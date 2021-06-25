import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';
import { MdContext } from 'sophize-md-parser';
import { AstNode } from 'sophize-md-parser/dist/src/md-utils';
import { Helpers } from '../helpers';
import { MarkdownParserService } from '../markdown-parser.service';

@Component({
  selector: 'sophize-md-viewer',
  templateUrl: './md-viewer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdViewerComponent implements OnChanges {
  @Input()
  content = '';

  @Input()
  mdContext: MdContext;

  parseTree$: Observable<AstNode[]> = of([]);

  constructor(public parserService: MarkdownParserService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (
      !Helpers.hasChanged(changes, 'content') &&
      !Helpers.hasChanged(changes, 'context')
    ) {
      return;
    }

    
    this.parseTree$ = this.parserService.parse(
      this.content,
      this.mdContext
    );
  }
}
