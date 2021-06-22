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
  PropositionPointer,
  Resource,
  ResourcePointer,
  ResourceType,
} from 'sophize-datamodel';
import {
  CaseOption,
  LinkOption,
  ResourceDisplayMode,
  ResourceDisplayOptions,
} from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { Helpers } from '../../helpers';

@Component({
  selector: 'sophize-md-resource-link',
  templateUrl: './md-resource-link.component.html',
  styleUrls: ['./md-resource-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdResourceLinkComponent implements OnChanges {
  readonly LinkOption = LinkOption;
  readonly ResourceType = ResourceType;
  @Input()
  displayInput = '';

  @Input()
  linkPtr: ResourcePointer | PropositionPointer;

  @Input()
  contextPtr: ResourcePointer;

  @Input()
  positive: boolean = true;

  @Input()
  parentPlainText = false;

  @Input()
  parentCaseOption: CaseOption = null;

  resource: Resource;
  finishedResourceFetch = false;
  resourceOptions: ResourceDisplayOptions;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !Helpers.hasChanged(changes, 'displayInput') &&
      !Helpers.hasChangedPtr(changes, 'contextPtr') &&
      !Helpers.hasChanged(changes, 'positive') &&
      !Helpers.hasChanged(changes, 'parentPlainText') &&
      !Helpers.hasChanged(changes, 'parentCaseOption')
    ) {
      if (this.linkPtr instanceof ResourcePointer) {
        if (!Helpers.hasChangedPtr(changes, 'linkPtr')) return;
      }
      if (this.linkPtr instanceof PropositionPointer) {
        if (!Helpers.hasChangedPropPtr(changes, 'linkPtr')) return;
      }
    }
    this.resourceOptions = new ResourceDisplayOptions(
      this.displayInput,
      this.parentPlainText,
      this.parentCaseOption
    );

    this.resource = null;
    this.finishedResourceFetch = false;

    this.dataProvider.getResource(this.resourcePtr).subscribe((resource) => {
      this.resource = resource;
      this.finishedResourceFetch = true;
      this.changeDetectorRef.markForCheck();
    });
  }

  isExpandMode() {
    return (
      this.resourceOptions?.getEffectiveMode(this.resource) ===
      ResourceDisplayMode.EXPAND
    );
  }

  goToResource() {
    if (!(this.resourceOptions?.linkOption === LinkOption.OVERLAY_LINK)) {
      return;
    }
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }

  showTruthValueIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.PROPOSITION &&
      this.resourceOptions?.shouldShowTVI()
    );
  }

  showValidityIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.ARGUMENT &&
      this.resourceOptions?.shouldShowValidity()
    );
  }

  showActivatedIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.MACHINE &&
      this.resourceOptions?.shouldShowActivated()
    );
  }

  getPropPtr() {
    return this.linkPtr instanceof PropositionPointer
      ? this.linkPtr
      : new PropositionPointer(this.resourcePtr, false);
  }

  get resourcePtr(): ResourcePointer {
    if (this.linkPtr instanceof PropositionPointer) {
      return this.linkPtr.ptr;
    } else {
      return this.linkPtr;
    }
  }
}
