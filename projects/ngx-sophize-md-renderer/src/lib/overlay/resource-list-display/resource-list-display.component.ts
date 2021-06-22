import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ResourcePointer, ResourceType } from 'sophize-datamodel';

@Component({
  selector: 'lib-resource-list-display',
  templateUrl: './resource-list-display.component.html',
  styleUrls: ['./resource-list-display.component.css'],
})
export class ResourceListDisplayComponent implements OnChanges {
  @Input()
  values: string[];

  @Input()
  formPlaceholder: string;

  @Input()
  resourceType = ResourceType.UNKNOWN;

  @Input()
  needsPropositionPointer = false;

  @Input()
  label = '';

  @Input()
  context: ResourcePointer;

  ptrs: ResourcePointer[];

  ngOnChanges(_: SimpleChanges): void {
    this.ptrs = this.values
      ? ResourcePointer.fromStringArr(this.values, this.context.datasetId)
      : [];
  }
}
