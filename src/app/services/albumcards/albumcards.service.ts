import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs';
import {AlbumCards} from 'src/app/models/albumcards';
import {Image} from 'src/app/models/image';
import {tap, map} from 'rxjs/operators';
import {ImageService} from '../image/image.service';

@Injectable({
  providedIn: 'root',
})
export class AlbumcardsService {
  albumcard$: Observable<AlbumCards[]>;

  constructor(private afs: AngularFirestore) {}

  addAlbumCards(albumUid: string, imageUid: string, nrOfCard: number, imageUrl: string) {
    const albumcardUid = this.afs.createId();
    return this.afs
      .collection<AlbumCards>('albumcards')
      .add({albumcardUid, albumUid, imageUid, imageUrl, nrOfCard});
  }

  getFirstNCardsForAlbum(albumUid, limit) {
    return this.afs.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', albumUid)
        .orderBy('nrOfCard', 'asc')
        .limit(limit)
    );
  }

  getNextNCards(albumUid, lastCard) {
    return this.afs.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', albumUid)
        .orderBy('nrOfCard')
        .startAfter(lastCard)
        .limit(8)
    );
  }

  getAlbumCards(albumUid, cardUid) {
    return this.afs
      .collection<AlbumCards>('albumcards', ref =>
        ref.where('albumUid', '==', albumUid).where('cardUid', '==', cardUid)
      )
      .valueChanges();
  }

  list(albumUid):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('albumcards');
        const snapshot = await collectionRef.ref.where('albumUid', '==', albumUid).get();
        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}));
        resolve(cards);
      } catch(e) {
        reject(e);
      }
    });
  }
  cardListlist(imageUid):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('images');
        const snapshot = await collectionRef.ref.where('imageUid', '==', imageUid).get();
        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id}));
        resolve(cards);
      } catch(e) {
        reject(e);
      }
    });
  }
  getCardsByPage(albumUid, minimum?, maximum?):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('albumcards');
        let snapshot;
        if(minimum && maximum) {
          snapshot = await collectionRef.ref.where('albumUid', '==', albumUid).where('nrOfCard', '>=', minimum).where('nrOfCard', '<=', maximum).orderBy('nrOfCard', 'asc').get();
        } else {
          snapshot = await collectionRef.ref.where('albumUid', '==', albumUid).orderBy('nrOfCard', 'asc').get();
        }

        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        resolve(cards);
      } catch(e) {
        reject(e);
      }
    })
  }

  addAlbumCard(albumUid, imageUrl, nrOfCard, title) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = await this.afs.collection('albumcards').add({albumUid, imageUrl, title, nrOfCard});
        resolve (docRef);
      } catch(e) {
        reject(e.message);
      }
    });
  }

  // addAlbumCards(albumUid: string, imageUid: string, nrOfCard: number) {
  //   const albumcardUid = this.afs.createId();
  //   return this.afs
  //     .collection<AlbumCards>('albumcards')
  //     .add({albumcardUid, albumUid, imageUid, nrOfCard});
  // }

  getMyCards(albumUid, userUid):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('userCards');
        const snapshot = await collectionRef.ref.where('albumUid', '==', albumUid).where('userUid', '==', userUid).where('isDragged', '==', false).get();
        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        resolve(cards);
      } catch(e) {
        reject(e);
      }
    })
  }

  getMyCardsPlaced(albumUid, userUid):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('userCards');
        const snapshot = await collectionRef.ref.where('albumUid', '==', albumUid).where('userUid', '==', userUid).where('isDragged', '==', true).get();
        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        resolve(cards);
      } catch(e) {
        reject(e);
      }
    })
  }
  
  updateUserCard(card):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.afs.collection('userCards').doc(card.id).set({...card}, { merge: true});
        resolve(true);
      } catch(e) {
        reject(e);
      }
    })
  }

  deleteAlbumCards(uid) {
    return this.afs
      .collection<AlbumCards>('albumcards')
      .doc(uid)
      .delete();
  }

  updateCardNumber(albumcard: AlbumCards) {
    return this.afs
      .collection('albumcards')
      .doc(albumcard.albumcardUid)
      .update(albumcard);
  }

  getAllCardsForAlbumUid(uid) {
    return this.afs
      .collection<AlbumCards>('albumcards', ref =>
        ref.where('albumUid', '==', uid).orderBy('nrOfCard')
      )
      .valueChanges();
  }

  getAllCardsUrlForAlbumUid(uid) {
    return this.getAllCardsForAlbumUid(uid)
       .pipe(map(images =>
        images.map(image =>
           this.afs.collection('images', ref =>
           ref.where('imageUid', '==', image.imageUid)))));
  }
}
