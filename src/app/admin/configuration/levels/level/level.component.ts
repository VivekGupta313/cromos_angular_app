import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Level, InitialLevel} from 'src/app/models/level';
import {LevelService} from 'src/app/services/level.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
})
export class LevelComponent implements OnInit {
  levels$: Observable<Level[]>;
  level: Level = InitialLevel;

  constructor(private levelService: LevelService) {}

  ngOnInit() {}

  addLevel(event) {
    this.levelService.addLevel(this.level);
  }
}
