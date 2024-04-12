import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {QueryConfig} from '../models/query-config';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';

import {tap, scan, take, map, switchMap} from 'rxjs/operators';
import {AlbumCards} from '../models/albumcards';
import {Image} from '../models/image';
import {analyzeAndValidateNgModules} from '@angular/compiler';
import {mapToExpression} from '@angular/compiler/src/render3/view/util';
import { MapOperator } from 'rxjs/internal/operators/map';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  // source data
  private _done = new BehaviorSubject(false);
  private _loading = new BehaviorSubject(false);
  private _data = new BehaviorSubject([]);

  private query: QueryConfig;

  data: Observable<any>;
  done: Observable<boolean> = this._done.asObservable();
  loading: Observable<boolean> = this._loading.asObservable();
  constructor(private afs: AngularFirestore) {}

  // Initial query sets options and defines the Observable
  // passing opts will override the defaults
  init(path: string, field: string, where: string) {
    this.query = {
      path,
      field,
      limit: 2,
      where,
    };

    const first = this.afs.collection(this.query.path, ref => {
      return ref
        .where(this.query.where, '==', this.query.field)
        .limit(this.query.limit);
    });

    this.mapAndUpdate(first);

    // Create the observable array for consumption in components
    this.data = this._data.asObservable().pipe(
      scan((acc, val) => {
        return val.concat(acc);
      })
    );
  }

  // Retrieves additional data from firestore
  next() {
    const cursor = this.getCursor();
    const more = this.afs.collection(this.query.path, ref => {
      return ref
        .where(this.query.where, '==', this.query.field)
        .limit(this.query.limit)
        .startAfter(cursor);
    });
    this.mapAndUpdate(more);
  }

  // Determines the doc snapshot to paginate query
  private getCursor() {}

  // Maps the snapshot to usable format the updates source
  private mapAndUpdate(col: any) {
    if (this._done.value || this._loading.value) {
      return;
    }

    // loading
    this._loading.next(true);

    // Map snapshot with doc ref (needed for cursor)
    return col
      .valueChanges()
      .pipe(
        map((albumcard: AlbumCards[]) => {
          if (albumcard[0]) {
            return albumcard[0].imageUid;
          }
        }),
        map((imageUid: string) => {
          return this.afs.collection('images', ref =>
            ref.where('imageUid', '==', imageUid)
          );
        }),
        tap(console.log)
      )
      .subscribe();
  }
}
