import {Component, OnInit} from '@angular/core';
import {LanguageService} from 'src/app/services/language.service';
import {Language, InitialLanguage} from 'src/app/models/language';

@Component({
  selector: 'app-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent implements OnInit {
  language: Language = InitialLanguage;

  constructor(private languageService: LanguageService) {}

  ngOnInit() {}

  addLanguage(e) {
    this.languageService.addLanguage(this.language);
  }
}
