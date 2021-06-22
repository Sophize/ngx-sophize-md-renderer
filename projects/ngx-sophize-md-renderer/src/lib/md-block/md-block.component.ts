import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: '[md-block]',
  templateUrl: './md-block.component.html',
  styleUrls: ['./md-block.component.scss'],
})
export class MdBlockComponent implements OnInit {
  @Input('md-block')
  nodes: any[];

  ngOnInit(): void {
    // console.log(this.nodes);
  }
}
