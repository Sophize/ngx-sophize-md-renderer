import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Language,
  Resource,
  ResourcePointer,
  ResourceType,
  Term,
} from 'sophize-datamodel';
import {
  LinkHelpers,
  ResourceDisplayMode,
  ResourceDisplayOptions,
} from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { MdViewerOptions } from '../../viewer-options';
import { metamathToMarkdown } from '../../metamath/metamath-parser';

@Component({
  selector: 'sophize-md-term-link',
  templateUrl: './md-term-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdTermLinkComponent implements OnChanges {
  readonly P_GET = 'fetch';
  readonly ResourceDisplayMode = ResourceDisplayMode;

  @Input()
  resourceOptions: ResourceDisplayOptions;

  @Input()
  resource: Resource;

  @Input()
  resourcePtr: ResourcePointer;

  @Input()
  contextPtr: ResourcePointer;

  definition = '';
  internalError = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.internalError =
      !ResourcePointer.isValid(this.resourcePtr) ||
      this.resourcePtr.resourceType !== ResourceType.TERM ||
      !this.resource ||
      !this.resourceOptions ||
      this.resourceOptions.getEffectiveMode(this.resource) !==
        ResourceDisplayMode.EXPAND;

    this.definition = this.getDefinition();
    this.changeDetectorRef.markForCheck();
    const term = this.resource as Term;
    if (term && term.language === Language.MetamathSetMm) {
      metamathToMarkdown(
        term.definition,
        ResourcePointer.fromStringArr(
          term.lookupTerms,
          this.resourcePtr.datasetId
        ),
        this.dataProvider
      ).subscribe((mdString) => {
        this.definition = mdString;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  goToResource() {
    if (this.resourceOptions.shouldShowPlainText()) return;
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }

  canApplyCase() {
    return LinkHelpers.canApplyCase(this.getRawDefinition());
  }

  getRawDefinition() {
    return (this.resource as Term).definition.trim();
  }

  getDefinition() {
    const definition = this.getRawDefinition();
    if (!this.canApplyCase()) return definition;
    return LinkHelpers.applyCase(definition, this.resourceOptions.caseOption);
  }

  get viewerOptions() {
    return new MdViewerOptions(
      this.resourceOptions.shouldShowPlainText(),
      this.resourceOptions.shouldRenderInline(),
      null,
      this.canApplyCase() ? null : this.resourceOptions.caseOption
    );
  }
}
