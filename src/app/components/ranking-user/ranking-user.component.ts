import {Component, OnInit, Input} from '@angular/core';
import {Group} from 'src/app/models/group';

@Component({
  selector: 'app-ranking-user',
  templateUrl: './ranking-user.component.html',
  styleUrls: ['./ranking-user.component.scss'],
})
export class RankingUserComponent implements OnInit {
  @Input() user;
  @Input() index;
  @Input() ranking;
  points: any;

  constructor() {}

  ngOnInit() {
    if(this.index == 0) {
        this.points = this.user['album_one_points'];
    } else if(this.index == 1) {
        this.points = this.user['album_one_points'];
    } else if(this.index == 2) {
        this.points = this.user['album_one_points'];
    }
  }
}
