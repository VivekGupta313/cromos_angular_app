import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ContactForm} from '../models/contactForm';
import {ToastService} from './toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ContactFormService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  addContactForm(message: ContactForm) {
    const uid = this.afsdb.createId();
    return this.afsdb
      .collection('contact-forms')
      .doc(uid)
      .set(message)
      .then(() =>
        this.toast.newToast({content: 'Email is sent', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
