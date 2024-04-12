import {Injectable} from '@angular/core';
import {Group} from '../models/group';

@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  constructor() {}

  getRndNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getRandom(arr, n) {
    const result = new Array(n);
    let len = arr.length;
    const taken = new Array(len);
    while (n--) {
      const x = Math.floor(Math.random() * len);
      result[n] = arr[x in taken ? taken[x] : x];
      taken[x] = --len in taken ? taken[len] : len;
    }
    return result;
  }
}
