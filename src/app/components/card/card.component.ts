import {Component, OnInit, Input} from '@angular/core';
import {CachedResourceLoader} from '@angular/platform-browser-dynamic/src/resource_loader/resource_loader_cache';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() cardUrl;
  @Input() cardNumber;
  constructor() {}

  ngOnInit() {}
}
