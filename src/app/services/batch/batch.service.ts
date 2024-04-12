import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Album} from 'src/app/models/album';
import {Image} from 'src/app/models/image';
import {ToastService} from '../toast/toast.service';
import {AlbumCards} from 'src/app/models/albumcards';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class BatchService {
  constructor(private afsdb: AngularFirestore, private toast: ToastService) {}

  async addImageToAlbum(album: Album, image: Image) {
    // Get a new write batch
    const batch = this.afsdb.firestore.batch();
    // // Update album nrOfCards
    const albumRef = await this.afsdb.firestore
      .doc(`albums/${album.albumUid}`)
      .get();

    // // tslint:disable-next-line:radix
    // const nrOfCards: number = album.nrOfCards + 1;
    // batch.update(albumRef, {nrOfCards});

    // Add new albumcards document
    const newId = this.afsdb.createId();
    const imageCardsRef = this.afsdb.firestore
      .collection('albumcards')
      .doc(newId);
    batch.set(imageCardsRef, {
      albumUid: album.albumUid,
      imageUid: image.imageUid,
      // nrOfCard: nrOfCards,
    });

    return batch
      .commit()
      .then(() => {
        this.toast.newToast({
          content: 'Image is added to album',
          style: 'success',
        });
      })
      .catch(err => {
        console.log('err:', err);
        this.toast.newToast({content: 'Error:' + err, style: 'warning'});
      });
  }

  async deleteAlbumCards(uid) {
    const batch = this.afsdb.firestore.batch();
    const qs = await this.afsdb.collection('albumcards').ref.get();
    qs.forEach(doc => {
      if (doc.data().albumUid === uid) {
        batch.delete(doc.ref);
      }
    });
    return batch.commit().then(
      () =>
        this.toast.newToast({
          content: 'Album is deleted!',
          style: 'success',
        }),
      err => this.toast.newToast({content: 'Error:' + err, style: 'warning'})
    );
  }

  deleteCardsFromAlbum(card) {}


  getFirstEightCardsForAlbum(albumUid) {
    return this.afsdb.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', albumUid)
        .orderBy('nrOfCard')
        .limit(8));
        // .get().then(function (documentSnapshots) {
        //   // Get the last visible document
        //   const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
        // });
  // };
}
}


