import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {ToastMessage} from 'src/app/models/toast-message';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastSource = new Subject<ToastMessage>();
  currentToast = this.toastSource.asObservable();

  constructor() {}

  newToast(toast: ToastMessage) {
    this.toastSource.next(toast);
  }
  getToast() {
    return this.toastSource.asObservable();
  }
  deleteToast() {
    this.toastSource.next();
  }
}
