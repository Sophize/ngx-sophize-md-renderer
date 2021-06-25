import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ResourcePointer, ResourceType } from 'sophize-datamodel';
import { LinkContent, LinkTarget, LinkType } from 'sophize-md-parser';

@Component({
  selector: 'sophize-md-link',
  templateUrl: './md-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdLinkComponent implements OnChanges {
  readonly P_GET = 'fetch';
  readonly LinkType = LinkType;
  readonly ResourceType = ResourceType;

  @Input()
  content: LinkContent;

  contextPtr: ResourcePointer;

  ngOnChanges(changes: SimpleChanges) {
    this.contextPtr = this.content.linkContext?.contextPtr;
  }

  get linkTarget(): LinkTarget {
    return this.content.linkTarget;
  }
}
