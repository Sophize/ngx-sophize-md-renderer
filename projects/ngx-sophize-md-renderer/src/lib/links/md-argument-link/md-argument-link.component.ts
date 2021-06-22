import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  SimpleChanges,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Argument,
  Language,
  PropositionPointer,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';
import { ResourceDisplayMode, ResourceDisplayOptions } from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { metamathToMarkdown } from '../../metamath/metamath-parser';
import { MdViewerOptions } from '../../viewer-options';

@Component({
  selector: 'sophize-md-argument-link',
  templateUrl: './md-argument-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdArgumentLinkComponent {
  readonly P_GET = 'fetch';

  @Input()
  resourceOptions: ResourceDisplayOptions;

  @Input()
  resource: Resource;

  @Input()
  resourcePtr: ResourcePointer;

  @Input()
  contextPtr: ResourcePointer;

  internalError = false;
  argText = '';

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.internalError =
      !ResourcePointer.isValid(this.resourcePtr) ||
      this.resourcePtr.resourceType !== ResourceType.ARGUMENT ||
      !this.resource ||
      !this.resourceOptions ||
      this.resourceOptions.getEffectiveMode(this.resource) !==
        ResourceDisplayMode.EXPAND;
    this.argText = this.argument.argumentText;
    this.changeDetectorRef.detectChanges();
    if (this.argument.language === Language.MetamathSetMm) {
      metamathToMarkdown(
        this.argument.argumentText,
        ResourcePointer.fromStringArr(
          this.argument.lookupTerms,
          this.resourcePtr.datasetId
        ),
        this.dataProvider
      ).subscribe((mdString) => {
        this.argText = mdString;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  goToResource() {
    if (this.resourceOptions.shouldShowPlainText()) return;
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }

  get argTextOptions() {
    // TODO: Support caseOption.
    return new MdViewerOptions(
      this.resourceOptions.shouldShowPlainText(),
      this.resourceOptions.shouldRenderInline(),
      true,
      null
    );
  }

  get argument() {
    return this.resource as Argument;
  }

  toPtr(s: string) {
    return PropositionPointer.fromString(s, this.resourcePtr.datasetId);
  }
}
