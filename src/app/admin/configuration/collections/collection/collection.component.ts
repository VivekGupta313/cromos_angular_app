import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Collection, InitialCollection} from 'src/app/models/collections';
import {CollectionService} from 'src/app/services/collection.service';

@Component({
  selector: 'app-collection',
  templateUrl: './collection.component.html',
  styleUrls: ['./collection.component.scss'],
})
export class CollectionComponent implements OnInit {
  collections$: Observable<Collection[]>;
  collection: Collection = InitialCollection;

  constructor(private collectionService: CollectionService) {}

  ngOnInit() {}

  addCollection(event) {
    this.collection.color = this.getRandomColor();
    console.log('collection', this.collection);
    this.collectionService.addCollection(this.collection);
  }

  getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
