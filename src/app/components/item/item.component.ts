import {Component, OnInit, Input} from '@angular/core';
import {Group} from 'src/app/models/group';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() group: Group;
  @Input() selected: boolean;
  @Input() private: boolean;
  @Input() joined: boolean;
  @Input() joinGroup: boolean;
  @Input() albumId: string;

  constructor() {}

  ngOnInit() {
  }
}
