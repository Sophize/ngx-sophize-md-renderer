import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ResourcePointer } from 'sophize-datamodel';
import { CaseOption } from 'sophize-md-parser';
import { MarkdownParserService } from '../markdown-parser.service';
import { Helpers } from '../helpers';
import { MdViewerOptions } from '../viewer-options';


@Component({
  selector: 'sophize-md-viewer',
  templateUrl: './md-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdViewerComponent implements OnChanges {
  @Input()
  content = '';

  @Input()
  context: ResourcePointer | null = null;

  @Input()
  viewerOptions = new MdViewerOptions(
    false,
    false,
    false,
    CaseOption.DEFAULT_CASE
  );

  // TODOX: Handle different languages (especially metamath).

  parseTree = [];

  constructor(public parserService: MarkdownParserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !Helpers.hasChanged(changes, 'content') &&
      !Helpers.hasChangedPtr(changes, 'context') &&
      !Helpers.hasChanged(changes, 'viewerOptions', MdViewerOptions.equals)
    ) {
      return;
    }

    if (this.viewerOptions.renderInline) {
      this.parseTree = this.parserService.parseInline(
        this.content,
        this.context,
        this.viewerOptions.plainText,
        this.viewerOptions.caseOption
      );
    } else {
      this.parseTree = this.parserService.parse(
        this.content,
        this.context,
        this.viewerOptions.plainText,
        this.viewerOptions.caseOption
      );
    }
    
    if (this.viewerOptions.firstParagraphToSpan && this.parseTree?.[0]?.type === 'paragraph') {
      this.parseTree[0].type = 'inline_paragraph';
    }
  }
}
