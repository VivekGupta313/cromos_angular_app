import {Injectable} from '@angular/core';
import {
  AngularFirestoreDocument,
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Album} from '../../models/album';
import {map} from 'rxjs/operators';
import {Image} from 'src/app/models/image';
import {ToastService} from '../toast/toast.service';
import {AlbumcardsService} from '../albumcards/albumcards.service';

@Injectable({
  providedIn: 'root',
})
export class AlbumService {
  albumRef: AngularFirestoreCollection<Album>;
  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private albumcards: AlbumcardsService
  ) {}

  addNewAlbum(album: Album) {
    album.albumUid = this.afs.createId();
    this.albumRef = this.afs.collection<Album>('albums');
    return this.albumRef.doc(album.albumUid).set(album);
  }

  updateAlbum(album) {
    this.afs
      .collection<Album>('albums')
      .doc(album.albumUid)
      .update(album);
  }

  addImageToAlbum(albumUid, imageUid) {
    return this.afs
      .doc<Album>(`albums/${albumUid}`)
      .get()
      .forEach(doc => {
        const nrOfCards: number = Number(doc.data().nrOfCards) + 1;
        this.afs
          .doc<Album>(`albums/${albumUid}`)
          .update({nrOfCards})
          .then(() => {
            const newId = this.afs.createId();
            return this.afs
              .collection('albumcards')
              .doc(newId)
              .set({
                albumUid,
                imageUid,
                nrOfCard: nrOfCards,
                albumcardUid: newId,
              });
          })
          .then(() =>
            this.toast.newToast({content: 'Image is added', style: 'success'})
          )
          .catch(err =>
            this.toast.newToast({content: 'Err:' + err, style: 'warning'})
          );
      });
  }
  removeImageFromAlbum(albumUid, albumcardsUid) {
    return this.afs
      .doc<Album>(`albums/${albumUid}`)
      .get()
      .forEach(doc => {
        const nrOfCards: number =
          Number(doc.data().nrOfCards) - 1 === 0
            ? 0
            : Number(doc.data().nrOfCards) - 1;
        this.afs
          .doc<Album>(`albums/${albumUid}`)
          .update({nrOfCards})
          .then(() => {
            return this.afs
              .collection('albumcards')
              .doc(albumcardsUid)
              .delete();
          })
          .then(() =>
            this.toast.newToast({
              content: 'Image is removed from album',
              style: 'success',
            })
          )
          .catch(err =>
            this.toast.newToast({content: 'Err:' + err, style: 'warning'})
          );
      });
  }

  getAllAlbums() {
    return this.afs.collection<Album>('albums').valueChanges();
  }

  list(): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('albums');
        const snapshot = await collectionRef.ref.get();
        const albums = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        resolve(albums);
      } catch(e) {
        reject(e);
      }
    })
  }

  listByCollection(collection): Promise<any[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('albums');
        const snapshot = await collectionRef.ref.where('collection', '==', collection).get();
        const albums = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        resolve(albums);
      } catch(e) {
        reject(e);
      }
    })
  }

  getRandomAlbums(albums: Album[], n): Album[] {
    const shuffled = albums.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  getAlbum(collection: string, albumName: string) {
    return this.afs
      .collection('albums', ref =>
        ref.where('collection', '==', collection).where('name', '==', albumName)
      )
      .valueChanges();
  }

  getAlbumItem(id) {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await this.afs.collection('albums').doc(id).get().toPromise();
        if (doc.exists) {
          const album = ({ ...doc.data(), id: id });
          return resolve(album);
        } else {
          return reject("No album found");
        }
      } catch (e) {
        console.log("Get album failed", e);
        reject(e.message);
      }
    });
  }

  getAlbumsFromCollection(collection: string) {
    return this.afs
      .collection('albums', ref => ref.where('collection', '==', collection))
      .valueChanges();
  }

  getRandomAlbum(albums: Album[]): Album {
    const rnd = Math.floor(Math.random() * albums.length);
    return albums[rnd];
  }

  deleteAlbum(uid) {
    return this.afs
      .collection<Album>('albums')
      .doc(uid)
      .delete();
  }

  getAlbumFromUid(uid: string) {
    // return this.afs
    //   .collection<Album>('albums', ref => ref.where('uid', '==', uid))
    //   .valueChanges();
    return this.afs.doc(`albums/${uid}`).valueChanges();
  }

  albumIncrementNrOfCards(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards + 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
      });
    });
  }

  albumDecreaseNrOfCards(uid) {
    const album_ref = this.afs.collection('shards').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
      });
    });
  }

  getImagesFromAlbum(uid) {
    const album_ref = this.afs.collection('albums').doc(uid);
    // Update count in a transaction
    return this.afs.firestore.runTransaction(t => {
      return t.get(album_ref[0]).then(doc => {
        const new_nrOfCards = doc.data().nrOfCards - 1;
        t.update(album_ref[0], {nrOfCards: new_nrOfCards});
      });
    });
  }

  getAlbumFromAlbumArray(albums, name, collection): Album {
    return albums.filter(
      album => album.name === name && album.collection === collection
    )[0];
  }

  getAlbumCollectionDetail(collection: string) {
    return this.afs
      .collection('collections', ref => ref.where('collection', '==', collection))
      .valueChanges();
  }

}
