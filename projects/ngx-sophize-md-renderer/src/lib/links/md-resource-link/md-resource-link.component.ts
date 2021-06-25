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
  options: ResourceDisplayOptions;

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

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !Helpers.hasChanged(changes, 'options') && // TODOX
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

    this.resource = null;
    this.finishedResourceFetch = false;

    this.dataProvider.getResources([this.resourcePtr]).subscribe((resources) => {
      this.resource = resources?.[0];
      this.finishedResourceFetch = true;
      this.changeDetectorRef.markForCheck();
    });
  }

  isExpandMode() {
    return (
      this.options?.getEffectiveMode(this.resource) ===
      ResourceDisplayMode.EXPAND
    );
  }

  goToResource() {
    if (!(this.options?.linkOption === LinkOption.OVERLAY_LINK)) {
      return;
    }
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }

  showTruthValueIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.PROPOSITION &&
      this.options?.shouldShowTVI()
    );
  }

  showValidityIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.ARGUMENT &&
      this.options?.shouldShowValidity()
    );
  }

  showActivatedIcon() {
    return (
      this.resourcePtr.resourceType === ResourceType.MACHINE &&
      this.options?.shouldShowActivated()
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
