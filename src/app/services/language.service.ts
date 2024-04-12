import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {ToastService} from './toast/toast.service';
import {Language} from '../models/language';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  getAllLanguages() {
    return this.afsdb.collection<Language>('languages').valueChanges();
  }

  addLanguage(language) {
    language.languageUid = this.afsdb.createId();
    return this.afsdb
      .collection<Language>('languages')
      .doc(language.languageUid)
      .set(language)
      .then(() =>
        this.toast.newToast({content: 'Language is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  updateLanguage(language) {
    return this.afsdb
      .collection('languages')
      .doc(language.languageUid)
      .update(language)
      .then(() =>
        this.toast.newToast({content: 'Language is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  deleteLanguage(uid) {
    return this.afsdb
      .collection('languages')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({content: 'Language is deleted', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
