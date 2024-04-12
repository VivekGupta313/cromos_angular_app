import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Theme, InitialTheme} from 'src/app/models/theme';
import {ThemeService} from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit {
  themes$: Observable<Theme[]>;
  theme: Theme = InitialTheme;

  constructor(private themeService: ThemeService) {}

  ngOnInit() {}

  addTheme(event) {
    this.themeService.addTheme(this.theme);
  }
}
