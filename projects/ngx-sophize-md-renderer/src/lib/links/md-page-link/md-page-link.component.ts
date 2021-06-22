import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Page, PagePointer, ResourcePointer } from 'sophize-datamodel';
import { AbstractDataProvider } from '../../data-provider';
import { Helpers } from '../../helpers';

export enum PageDisplayMode {
  UNKNOWN = 'UNKNOWN',
  CUSTOM = 'CUSTOM',
  REFERENCE = 'REFERENCE',
  DEFAULT = 'DEFAULT',
}

@Component({
  selector: 'sophize-md-page-link',
  templateUrl: './md-page-link.component.html',
})
export class MdPageLinkComponent {
  @Input()
  displayInput = '';

  @Input()
  pagePtr: PagePointer;

  @Input()
  contextPtr: ResourcePointer;

  linkText = '';
  displayMode = PageDisplayMode.DEFAULT;
  page: Page = null;

  constructor(
    private dataProvider: AbstractDataProvider,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (!this.pagePtr) {
      this.linkText = 'BUG BUG!';
      return;
    }
    this.page = null;
    this.displayMode = MdPageLinkComponent.getDisplayMode(this.displayInput);
    this.linkText = this.getLinkText();

    if (this.displayMode == PageDisplayMode.DEFAULT) {
      this.dataProvider.getPages(this.pagePtr.projectPtr).subscribe((pages) => {
        this.page = Helpers.findPage(this.pagePtr.pageId, pages);
        this.linkText = this.getLinkText();
        this.changeDetectorRef.detectChanges();
      });
    }
  }

  get isRouterLink() {
    return this.pageLink?.startsWith('/');
  }

  get pageLink() {
    return this.dataProvider.getPageNavRoute(
      this.pagePtr.projectPtr,
      this.pagePtr.pageId
    );
  }

  private static getDisplayMode(displayString: string) {
    if (!displayString) return PageDisplayMode.DEFAULT;

    if (
      displayString.startsWith("'") &&
      displayString.endsWith("'") &&
      displayString.length > 2
    ) {
      return PageDisplayMode.CUSTOM;
    }

    switch (displayString.toUpperCase()) {
      case PageDisplayMode.DEFAULT:
        return PageDisplayMode.DEFAULT;
      case PageDisplayMode.REFERENCE:
        return PageDisplayMode.REFERENCE;
    }
    return PageDisplayMode.DEFAULT;
  }

  private getLinkText() {
    if (this.displayMode === PageDisplayMode.UNKNOWN) {
      return 'Unknown link format';
    }
    if (this.displayMode === PageDisplayMode.CUSTOM) {
      return this.displayInput.slice(1, -1);
    }
    if (
      this.displayMode === PageDisplayMode.REFERENCE ||
      !this.page ||
      !this.page.title
    ) {
      return this.pagePtr.toString();
    }
    return this.page.title; // PageDisplayMode.DEFAULT
  }
}
