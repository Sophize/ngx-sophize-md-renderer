import { CaseOption } from 'sophize-md-parser';
export class MdViewerOptions {
  constructor(
    // All these options are only relevant for md-resource-link for now.
    // We may have more options for other widgets in the future.
    public plainText: boolean,
    public renderInline: boolean,
    public firstParagraphToSpan: boolean,
    public caseOption: CaseOption
  ) {}

  public static equals(opt1: MdViewerOptions, opt2: MdViewerOptions) {
    if (!opt1 || !opt2) return !opt1 && !opt2;
    return (
      opt1.plainText === opt2.plainText &&
      opt1.renderInline === opt2.renderInline &&
      opt1.firstParagraphToSpan === opt2.firstParagraphToSpan &&
      opt1.caseOption === opt2.caseOption
    );
  }
}
