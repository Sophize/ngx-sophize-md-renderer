import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'lib-string-list-display',
  templateUrl: './string-list-display.component.html',
  styleUrls: ['./string-list-display.component.css'],
})
export class StringListDisplayComponent {
  @Input()
  values: string[];

  @Input()
  label = '';

  @Input()
  horizontalView = true;

  @Input()
  useMarkdown = false;
}
