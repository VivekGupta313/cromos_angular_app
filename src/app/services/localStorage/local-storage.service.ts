import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  logened = new Subject<boolean>();
  user_name_changed = new Subject<boolean>();
  subject;
  constructor() { }

  getStorage(key: string): Observable<string> {
    this.subject = new BehaviorSubject<string>('');
    this.subject.next(localStorage.getItem(key));
    return this.subject.asObservable();
  }


  setStorage(key, value) {
    if (key === 'user_name') {
      this.user_name_changed.next(value);
    }
    // this.logened.next(true);
    return localStorage.setItem(key, value);
  }
}
