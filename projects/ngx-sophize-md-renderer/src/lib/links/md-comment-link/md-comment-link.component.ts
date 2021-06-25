import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
// import { CommentHelpers } from '../../../comments/comment-helpers';
import { ResourcePointer } from 'sophize-datamodel';
import { CommentDisplayOptions } from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';

function getCommentFragment(commentId: number) {
  return !commentId ? undefined : 'comment-' + commentId;
}

@Component({
  selector: 'sophize-md-comment-link',
  templateUrl: './md-comment-link.component.html',
})
export class MdCommentLinkComponent implements OnChanges {
  readonly P_GET = 'fetch';

  @Input()
  options: CommentDisplayOptions;

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

      this.dataProvider.getResources([this.ptrFromUrl]).subscribe((r) => {
        if (!r?.[0]) return;
        const stringPtr =
          this.ptrFromUrl && this.ptrFromUrl.isAssignablePtr()
            ? r[0].permanentPtr
            : r[0].assignablePtr;
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
    this.linkText = this.options.customText || this.getReferenceString();
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

  getReferenceString() {
    if (this.linkPtr.equals(this.linkPtr)) {
      return '#' + this.commentId;
    }
    const ptrDisplay = this.linkPtr.toDisplayString(this.contextPtr?.datasetId);
    return '#' + ptrDisplay + '/' + this.commentId;
  }
}
