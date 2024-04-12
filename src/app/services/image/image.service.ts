import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {Observable, of, pipe, combineLatest} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumService} from '../album/album.service';
import {map, switchMap, flatMap, tap} from 'rxjs/operators';
import {Image} from 'src/app/models/image';
import {AlbumcardsService} from '../albumcards/albumcards.service';
import {AlbumCards} from 'src/app/models/albumcards';
import {UtilityService} from '../utility.service';

import {dummyImage} from '../../models/image';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  albums$: Observable<Album[]>;
  albums: Album[];
  constructor(
    private afs: AngularFirestore,
    private albumService: AlbumService,
    private albumcards: AlbumcardsService,
    private utility: UtilityService
  ) {}

  getRndImage(images: Image[]) {
    const rnd = Math.floor(Math.random() * Object.keys(images).length);
    return images[rnd];
  }

  getRandomImageFromDB() {
    return this.afs
      .collection('images', ref =>
        ref.where('albumUid', '==', '7dsLmxglXdUt97WNwuPb')
      )
      .valueChanges();
  }

  getAllImages() {
    return this.afs.collection<Image>('images').valueChanges();
  }

  list():Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('images');
        const snapshot = await collectionRef.ref.get();
        const images = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
  
        resolve(images);
      } catch(e) {
        reject(e);
      }
    })
  }

  getRandomImages(albums: Image[], n): Image[] {
    const shuffled = albums.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }

  getImagesForAlbum(albumUid: string) {
    return this.afs
      .collection('images', ref => ref.where('albumUId', '==', albumUid))
      .valueChanges()
      .pipe(
        map(images =>
          images.sort(
            (a: Image, b: Image) =>
              +a.imgName.replace(/[^\d]/g, '') -
              +b.imgName.replace(/[^\d]/g, '')
          )
        )
      );
  }
  getCardsForAlbum(imageUid: string):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const cards =await  this.afs
      .collection('images', ref => ref.where('imageUid', '==', imageUid))
      .valueChanges()
      .pipe(
        map(images =>
          images.sort(
            (a: Image, b: Image) =>
              +a.imgName.replace(/[^\d]/g, '') -
              +b.imgName.replace(/[^\d]/g, '')
          )
        )  
      );   
      resolve(cards); 
      } catch (error) {
        reject(error);
      }
    });
    
  }
  addImage(image) {
    const imageUid = this.afs.createId();
    image.imageUid = imageUid;
    return this.afs
      .collection<Image>('images')
      .doc(imageUid)
      .set(image);
  }

  getRndImageForAlbum(images: Image[], album) {
    // const tempImg = images.filter(image => image.albumUId === album.uid);
    // return this.getRndImage(tempImg);
  }

  getFirstNImagesFromAlbum(album, n) {
    return this.afs.collection('albumcards', ref =>
      ref
        .where('albumUid', '==', album.albumUid)
        .orderBy('albumUid')
        .limit(n)
    );
  }

  getRandomImageFromAlbum(album: Album) {
    const cardNumber = this.utility.getRndNumber(1, album.nrOfCards);
    // tslint:disable-next-line:max-line-length
    return this.afs
      .collection<'AlbumCards'>('albumcards', ref =>
        ref
          .where('albumUid', '==', album.albumUid)
          .where('nrOfCard', '==', cardNumber)
      )
      .valueChanges()
      .pipe(
        map((albumcard: AlbumCards[]) => {
          if (albumcard[0]) {
            return albumcard[0].imageUid;
          }
        }),
        switchMap((imageUid: string) => {
          if (imageUid) {
            return this.afs
              .collection<'Image'>('images', ref =>
                ref.where('imageUid', '==', imageUid)
              )
              .valueChanges();
          } else {
            return of([dummyImage]);
          }
        })
      );
  }

  getNCardsForAlbum(albumcards: AngularFirestoreCollection<any>) {
    return albumcards.valueChanges().pipe(
      map((albumcard: AlbumCards[]) => {
        if (albumcard) {
          return albumcard.map(item => item.imageUid);
        }
      }),
      map(imagesUid => {
        if (imagesUid) {
          return imagesUid.map(imageUid =>
            this.afs
              .collection<'Image'>('images', ref =>
                ref.where('imageUid', '==', imageUid)
              )
              .valueChanges()
          );
        }
      }),
      flatMap(afobj =>
        combineLatest(afobj).pipe(
          map(arr => arr.reduce((acc, cur) => acc.concat(cur)))
        )
      ),
      tap(console.log)
    );
  }

  updateImage(image: Image) {
    return this.afs
      .collection<Image>('images')
      .doc(image.imageUid)
      .update(image);
  }

  getImagesWithUid(imageUid) {
    return this.afs
      .collection('images', ref => ref.where('imageUid', '==', imageUid))
      .valueChanges();
  }

  deleteImage(image: Image) {
    return this.afs
      .collection<Image>('Image')
      .doc(image.imageUid)
      .delete();
  }

  getImageFromUid(uid) {
    return this.afs
      .collection('images', ref => ref.where('uid', '==', uid))
      .valueChanges();
  }

  getCurrentImage(albumcard: AlbumCards) {
    return this.afs.doc<Image>(`images/${albumcard.imageUid}`).valueChanges();
  }
}
