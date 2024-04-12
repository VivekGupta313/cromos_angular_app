import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Level} from '../models/level';
import {ToastService} from './toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  getAllLevels() {
    return this.afsdb.collection<Level>('levels').valueChanges();
  }

  addLevel(level) {
    level.levelUid = this.afsdb.createId();
    return this.afsdb
      .collection<Level>('levels')
      .doc(level.levelUid)
      .set(level)
      .then(() =>
        this.toast.newToast({content: 'Level is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  updateLevels(level) {
    return this.afsdb
      .collection('levels')
      .doc(level.levelUid)
      .update(level)
      .then(() =>
        this.toast.newToast({content: 'Level is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  deleteLevel(uid) {
    return this.afsdb
      .collection('levels')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({content: 'Level is deleted', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
