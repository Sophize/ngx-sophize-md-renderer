import {
  ChangeDetectionStrategy,
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
  LinkHelpers,
  LinkOption,
  ResourceDisplayMode,
  ResourceDisplayOptions,
} from 'sophize-md-parser';
import { AbstractDataProvider } from '../../data-provider';
import { Helpers } from '../../helpers';

function getReferenceString(
  ptr: ResourcePointer | PropositionPointer,
  context?: ResourcePointer
) {
  // TODO: Consolidate all link <--> Ptr conversions in a util library.
  if (ptr instanceof ResourcePointer) {
    const resourcePtr = ptr as ResourcePointer;
    return '#' + resourcePtr.toDisplayString(context && context.datasetId);
  } else {
    const propPtr = ptr as PropositionPointer;
    return '#' + propPtr.toDisplayString(context && context.datasetId);
  }
}

function getLinkText(
  r: Resource,
  ptr: ResourcePointer | PropositionPointer,
  resourceOptions: ResourceDisplayOptions,
  finishedResourceFetch: boolean,
  contextPtr?: ResourcePointer
) {
  const mode = resourceOptions.getEffectiveMode(r);
  if (!mode) {
    return 'Unknown display mode';
  }
  if (mode === ResourceDisplayMode.CUSTOM) {
    return LinkHelpers.applyCase(
      resourceOptions.customText.slice(1, -1),
      resourceOptions.caseOption
    );
  }
  const inputReferenceString = getReferenceString(ptr, contextPtr);

  if (!finishedResourceFetch) return inputReferenceString + ' …';

  // Fallback to reference string if resource couldn't be fetched.
  if (!r) return inputReferenceString;

  let finalPtr: ResourcePointer | PropositionPointer = Helpers.getDisplayPtr(
    r,
    ptr.datasetId
  );
  if (ptr instanceof PropositionPointer) {
    finalPtr = new PropositionPointer(
      finalPtr as ResourcePointer,
      ptr.negative
    );
  }
  const finalReferenceString = getReferenceString(finalPtr, contextPtr);

  if (mode === ResourceDisplayMode.REFERENCE) return finalReferenceString;
  if (mode === ResourceDisplayMode.NAME) {
    const name = Helpers.getPrimaryName(r);
    return !name
      ? finalReferenceString
      : LinkHelpers.applyCase(name, resourceOptions.caseOption);
  }
  return 'BUG BUG!';
}

@Component({
  selector: 'sophize-md-simple-resource-link',
  templateUrl: './md-simple-resource-link.component.html',
  styleUrls: ['./md-simple-resource-link.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdSimpleResourceLinkComponent implements OnChanges {
  readonly LinkOption = LinkOption;
  readonly ResourceType = ResourceType;

  @Input()
  resourceOptions: ResourceDisplayOptions;

  @Input()
  linkPtr: ResourcePointer | PropositionPointer;

  @Input()
  contextPtr: ResourcePointer;

  @Input()
  resource: Resource;

  @Input()
  finishedResourceFetch = false;

  displayText = '';

  constructor(
    private dialog: MatDialog,
    private dataProvider: AbstractDataProvider
  ) {}

  ngOnChanges(_: SimpleChanges): void {
    this.setDisplayText();
  }

  setDisplayText() {
    this.displayText = getLinkText(
      this.resource,
      this.linkPtr,
      this.resourceOptions,
      this.finishedResourceFetch,
      this.contextPtr
    );
  }

  get isRouterLink() {
    return this.resourceLink?.startsWith('/');
  }

  get resourceLink() {
    return this.dataProvider.getResourceNavRoute(this.resourcePtr);
  }

  get displayPtr() {
    return this.resource
      ? Helpers.getDisplayPtr(this.resource, this.contextPtr?.datasetId)
      : this.linkPtr;
  }

  get resourcePtr(): ResourcePointer {
    if (this.linkPtr instanceof PropositionPointer) {
      return this.linkPtr.ptr;
    } else {
      return this.linkPtr;
    }
  }

  get isOverlayOrNoLink() {
    return (
      this.resourceOptions &&
      [LinkOption.OVERLAY_LINK, LinkOption.NO_LINK].includes(
        this.resourceOptions.linkOption
      )
    );
  }

  get isOverlay() {
    return this.resourceOptions?.linkOption === LinkOption.OVERLAY_LINK;
  }

  goToResource() {
    if (!(this.resourceOptions?.linkOption === LinkOption.OVERLAY_LINK)) {
      return;
    }
    this.dataProvider.onResourceOverlayAction(this.resourcePtr, this.dialog);
  }
}
