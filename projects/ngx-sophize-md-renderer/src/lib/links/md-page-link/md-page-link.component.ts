import {
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { Page, PagePointer, ResourcePointer } from 'sophize-datamodel';
import { PageDisplayMode, PageDisplayOptions } from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { Helpers } from '../../helpers';

@Component({
  selector: 'sophize-md-page-link',
  templateUrl: './md-page-link.component.html',
})
export class MdPageLinkComponent {
  @Input()
  options: PageDisplayOptions;

  @Input()
  pagePtr: PagePointer;

  @Input()
  contextPtr: ResourcePointer;

  linkText = '';
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
    this.linkText = this.getLinkText();

    if (this.options.mode == PageDisplayMode.DEFAULT) {
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

  private getLinkText() {
    if (this.options.customText) return this.options.customText;
    if (this.options.mode === PageDisplayMode.REFERENCE || !this.page?.title) {
      return this.pagePtr.toString();
    }
    return this.page.title; // PageDisplayMode.DEFAULT
  }
}
