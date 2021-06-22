import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Helpers } from '../helpers';

@Component({
  selector: 'sophize-md-partial-latex',
  templateUrl: './md-partial-latex.component.html',
})
export class MdPartialLatexComponent implements OnChanges {
  @Input()
  inputString = '';

  sections = [] as { text: string; isLatex: boolean }[];

  ngOnChanges(changes: SimpleChanges): void {
    if (!Helpers.hasChanged(changes, 'inputString')) return;
    this.sections = Helpers.getPartialLatexSections(this.inputString);
  }
}
