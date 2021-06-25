import { Injectable } from '@angular/core';
import { ResourcePointer } from 'sophize-datamodel';
import { CaseOption, MarkdownParser, MdContext } from 'sophize-md-parser';
import { AbstractDataProvider } from './data-provider';

@Injectable({
  providedIn: 'root',
})
export class MarkdownParserService {
  parser = new MarkdownParser();

  constructor(private dataProvider: AbstractDataProvider) {}

  parse(
    mdString: string,
    mdContext: MdContext
  ) {
    return this.parser.parseExpanded(
      mdString,
      (ptrs) => this.dataProvider.getResources(ptrs),
      (l, strs) => this.dataProvider.getLatexDefs(l, strs),
      mdContext
    );
  }
}
