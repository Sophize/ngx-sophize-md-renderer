import { Injectable } from '@angular/core';
import { ResourcePointer } from 'sophize-datamodel';
import { CaseOption, MarkdownParser } from 'sophize-md-parser';

@Injectable({
  providedIn: 'root',
})
export class MarkdownParserService {
  parser = new MarkdownParser();

  parse(
    mdString: string,
    contextPtr: ResourcePointer,
    plainText: boolean,
    caseOption: CaseOption
  ) {
    return this.parser.parse(mdString, contextPtr, plainText, caseOption);
  }

  parseInline(
    mdString: string,
    contextPtr: ResourcePointer,
    plainText: boolean,
    caseOption: CaseOption
  ) {
    return this.parser.parse(mdString, contextPtr, plainText, caseOption);
  }
}
