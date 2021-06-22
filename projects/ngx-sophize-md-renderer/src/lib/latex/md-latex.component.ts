import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import * as katex from 'katex';

@Component({
  selector: 'sophize-md-latex',
  templateUrl: './md-latex.component.html',
  styleUrls: ['./md-latex.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MdLatexComponent implements OnChanges {
  @Input()
  displayMode = false;

  @Input()
  latex = '';

  @Input()
  equationInput = null as string;

  rendered = '';
  error = '';

  ngOnChanges(changes: SimpleChanges): void {
    const corrected = this.latex; // this.fixForXYMatrix(this.latex);
    try {
      this.rendered = katex.renderToString(corrected, {
        displayMode: this.displayMode,
      });
    } catch (err) {
      console.log(err.message);
      this.error = '!' + this.latex + '!';
    }
  }

  fixForXYMatrix(s: string) {
    // Create test:
    /*$$a $v$ a$$

        $$a \text{$v$} a$$

        defined by $$\delta_{x_0}(x) :=
        \begin{cases}
        1, & $if_t$\;\; x=x_0\\
        0 & \text{if_t}\;\; x \neq x_0
        \end{cases}$$*/

    // surrounding $ can be skipped in trivial cases but will cause parse failures in most.
    s = s.replace(/(\$[^\s$\\]*\$)/g, '\\text{$1}');

    if (!s.includes('\\xymatrix')) return s;
    s = s.replace(/\\xymatrix/g, '\\boxed{xymatrix}');
    s = s.replace(/\&/g, '\\boxed{\\&}');
    s = s.replace(/\\ar/g, '\\boxed{ar}');
    return s;
  }
}
