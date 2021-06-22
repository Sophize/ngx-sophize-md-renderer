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
  Proposition,
  PropositionPointer,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';
import {
  LinkHelpers,
  ResourceDisplayMode,
  ResourceDisplayOptions,
} from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { metamathToMarkdown } from '../../metamath/metamath-parser';
import { MdViewerOptions } from '../../viewer-options';

function propositionToString(p: Proposition, positiveStatement: boolean) {
  if (positiveStatement) {
    return p.statement;
  }
  if (p.negativeStatement) {
    return p.negativeStatement;
  } else {
    return ' _It is false that_: ' + p.statement;
  }
}

@Component({
  selector: 'sophize-md-proposition-link',
  templateUrl: './md-proposition-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdPropositionLinkComponent implements OnChanges {
  readonly P_GET = 'fetch';

  @Input()
  resourceOptions: ResourceDisplayOptions;

  @Input()
  resource: Resource;

  @Input()
  linkPtr: ResourcePointer | PropositionPointer;

  @Input()
  contextPtr: ResourcePointer;

  propositionStatement = '';

  internalError = false;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    this.internalError =
      !ResourcePointer.isValid(this.resourcePtr) ||
      this.resourcePtr.resourceType !== ResourceType.PROPOSITION ||
      !this.resource ||
      !this.resourceOptions ||
      this.resourceOptions.getEffectiveMode(this.resource) !==
        ResourceDisplayMode.EXPAND;

    this.propositionStatement = this.getPropositionStatement();
    this.changeDetectorRef.markForCheck();
    const proposition = this.resource as Proposition;
    if (proposition && proposition.language === Language.MetamathSetMm) {
      metamathToMarkdown(
        proposition.statement,
        ResourcePointer.fromStringArr(
          proposition.lookupTerms,
          this.resourcePtr.datasetId
        ),
        this.dataProvider
      ).subscribe((mdString) => {
        this.propositionStatement =
          (this.getPropPtr().negative ? ' _It is false that_: ' : '') +
          mdString;
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  goToResource() {
    if (this.resourceOptions.shouldShowPlainText()) return;
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }

  getPropPtr() {
    return this.linkPtr instanceof PropositionPointer
      ? this.linkPtr
      : new PropositionPointer(this.resourcePtr, false);
  }

  get resourcePtr() {
    if (this.linkPtr instanceof PropositionPointer) return this.linkPtr.ptr;
    return this.linkPtr;
  }

  getPropositionStatement() {
    const statement = this.getRawStatement();
    if (!this.canApplyCase()) return statement;
    return LinkHelpers.applyCase(statement, this.resourceOptions.caseOption);
  }

  get viewerOptions() {
    return new MdViewerOptions(
      this.resourceOptions.shouldShowPlainText(),
      this.resourceOptions.shouldRenderInline(),
      true,
      this.canApplyCase() ? null : this.resourceOptions.caseOption
    );
  }

  canApplyCase() {
    return LinkHelpers.canApplyCase(this.getRawStatement());
  }

  getRawStatement() {
    return propositionToString(
      this.resource as Proposition,
      !this.getPropPtr().negative
    ).trim();
  }

  get context() {
    if (this.linkPtr instanceof PropositionPointer) {
      return this.linkPtr.ptr;
    }
    return this.linkPtr;
  }
}
