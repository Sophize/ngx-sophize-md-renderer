import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResourcePointer, ResourceType } from 'sophize-datamodel';

@Component({
  selector: 'lib-resource-overlay',
  templateUrl: './resource-overlay.component.html'
})
export class ResourceOverlayComponent {
  readonly ResourceType = ResourceType;

  resourcePtr: ResourcePointer;

  constructor(
    private dialogRef: MatDialogRef<ResourceOverlayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ResourcePointer
  ) {
    this.resourcePtr = data;
  }

  close() {
    this.dialogRef.close();
  }
}
