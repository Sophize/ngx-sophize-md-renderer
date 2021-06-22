import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { CommentHelpers } from '../../../comments/comment-helpers';
import { ResourcePointer } from 'sophize-datamodel';
import { AbstractDataProvider } from '../../data-provider';

export enum CommentDisplayMode {
  UNKNOWN = 'UNKNOWN',
  CUSTOM = 'CUSTOM',
  DEFAULT = 'DEFAULT',
}

function getCommentFragment(commentId: number) {
  return !commentId ? undefined : 'comment-' + commentId;
}

@Component({
  selector: 'sophize-md-comment-link',
  templateUrl: './md-comment-link.component.html',
})
export class MdCommentLinkComponent implements OnChanges {
  readonly P_GET = 'fetch';
  readonly CommentDisplayMode = CommentDisplayMode;

  @Input()
  displayInput = '';

  @Input()
  linkPtr: ResourcePointer;

  @Input()
  commentId: number;

  @Input()
  contextPtr: ResourcePointer;

  ptrFromUrl: ResourcePointer;
  ptrFromUrl2: ResourcePointer;

  linkText = '';
  comment: Comment;
  displayMode = CommentDisplayMode.DEFAULT;

  constructor(
    private dataProvider: AbstractDataProvider,
    route: ActivatedRoute
  ) {
    route.paramMap.subscribe((paramMap) => {
      const datasetId = paramMap.get('dataset_id');
      const resource_show_id = paramMap.get('resource_show_id');
      this.ptrFromUrl = ResourcePointer.fromString(
        [datasetId, resource_show_id].join('/')
      );

      this.dataProvider.getResource(this.ptrFromUrl).subscribe((r) => {
        if (!r) return;
        const stringPtr =
          this.ptrFromUrl && this.ptrFromUrl.isAssignablePtr()
            ? r.permanentPtr
            : r.assignablePtr;
        this.ptrFromUrl2 = ResourcePointer.fromString(
          stringPtr,
          this.contextPtr.datasetId
        ); // TODOX
      });
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!ResourcePointer.isValid(this.linkPtr) || !this.commentId) {
      this.linkText = 'BUG BUG!';
      return;
    }

    this.displayMode = MdCommentLinkComponent.getDisplayMode(this.displayInput);
    this.linkText = this.getLinkText();
  }

  get isRouterLink() {
    return this.commentLink?.startsWith('/');
  }

  get commentLink() {
    if (!this.linkPtr) return null;
    let ptrToUse = this.linkPtr;
    if (this.linkPtr.equals(this.ptrFromUrl2)) {
      ptrToUse = this.ptrFromUrl;
    }
    return this.dataProvider.getResourceNavRoute(ptrToUse);
  }

  get fragment() {
    return getCommentFragment(this.commentId);
  }

  isNewTab() {
    if (
      this.linkPtr &&
      !this.linkPtr.equals(this.ptrFromUrl) &&
      !this.linkPtr.equals(this.ptrFromUrl2)
    ) {
      return '_blank';
    }
    return '';
  }

  private static getDisplayMode(displayString: string) {
    if (!displayString) return CommentDisplayMode.DEFAULT;

    if (
      displayString.startsWith("'") &&
      displayString.endsWith("'") &&
      displayString.length > 2
    ) {
      return CommentDisplayMode.CUSTOM;
    }

    switch (displayString.toUpperCase()) {
      case CommentDisplayMode.DEFAULT:
        return CommentDisplayMode.DEFAULT;
    }
    return CommentDisplayMode.UNKNOWN;
  }

  private getLinkText() {
    if (this.displayMode === CommentDisplayMode.UNKNOWN) {
      return 'Unknown link format';
    }
    if (this.displayMode === CommentDisplayMode.CUSTOM) {
      return this.displayInput.slice(1, -1);
    }
    return this.getReferenceString();
  }

  private getReferenceString() {
    const ptrPart = '';
    if (this.contextPtr) {
      if (this.contextPtr.equals(this.linkPtr)) {
        return '#' + this.commentId;
      }
      if (this.contextPtr.datasetId === this.linkPtr.datasetId) {
        return (
          '#' +
          this.linkPtr.toString(this.contextPtr.datasetId) +
          '/' +
          this.commentId
        );
      }
    }
    return '#' + this.linkPtr.toString() + '/' + this.commentId;
  }
}
