import {Injectable} from '@angular/core';
import {ToastService} from './toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class FirebaseErrorsService {
  constructor(private toast: ToastService) {}

  getError(err) {
    switch (err.code) {
      case 'auth/user-not-found': {
        return this.toast.newToast({
          content: 'User is not found. Please register',
          style: 'warning',
        });
        break;
      }
      case 'auth/wrong-password': {
        return this.toast.newToast({
          content: 'Password is wrong',
          style: 'warning',
        });
        break;
      }
      case 'auth/email-already-in-use': {
        return this.toast.newToast({
          content: 'Email is already in use',
          style: 'warning',
        });
        break;
      }
    }
  }
}
