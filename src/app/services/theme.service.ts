import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Theme} from '../models/theme';
import {ToastService} from './toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  getAllThemes() {
    return this.afsdb.collection<Theme>('themes').valueChanges();
  }

  addTheme(theme) {
    theme.themeUid = this.afsdb.createId();
    return this.afsdb
      .collection<Theme>('themes')
      .doc(theme.themeUid)
      .set(theme)
      .then(() =>
        this.toast.newToast({content: 'Theme is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  updateThemes(theme) {
    return this.afsdb
      .collection('themes')
      .doc(theme.themeUid)
      .update(theme)
      .then(() =>
        this.toast.newToast({content: 'Theme is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  deleteTheme(uid) {
    return this.afsdb
      .collection('themes')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({content: 'Theme is deleted', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
