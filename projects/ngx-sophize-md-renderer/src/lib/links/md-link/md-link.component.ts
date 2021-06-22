import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ResourcePointer, ResourceType } from 'sophize-datamodel';
import { CaseOption, LinkContent } from 'sophize-md-parser';
import { LinkHelpers, LinkTarget, LinkType } from 'sophize-md-parser';

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

  displayInput = '';
  targetInput = '';
  contextPtr: ResourcePointer;
  linkTarget: LinkTarget;
  parentCaseOption: CaseOption = null;
  parentPlainText: boolean;

  ngOnChanges(changes: SimpleChanges) {
    this.displayInput = this.content.display;
    this.targetInput = this.content.target;
    this.contextPtr = this.content.linkContext.contextPtr;
    this.linkTarget = LinkHelpers.getLinkTarget(
      this.targetInput,
      this.contextPtr
    );

    this.parentCaseOption = this.content.linkContext.caseOption;
    this.parentPlainText = this.content.linkContext.plainText;
  }
}
