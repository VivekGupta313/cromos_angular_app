import {Injectable} from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import {User} from 'src/app/models/User';
import {map, tap} from 'rxjs/operators';
import {ToastService} from '../toast/toast.service';
import {LocalStorageService} from '../localStorage/local-storage.service';
import {ImageService} from '../image/image.service';
import {Image} from 'src/app/models/image';
import {AlbumcardsService} from '../albumcards/albumcards.service';
import {AngularFireAuth} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userDoc: AngularFirestoreDocument<User>;
  users: AngularFirestoreCollection<User>;
  private user: any = {};
  private usersLocation: string = "users";

  constructor(
    private afs: AngularFirestore,
    private toast: ToastService,
    private fireAuth: AngularFireAuth,
    private localStorage: LocalStorageService,
    private imageCards: AlbumcardsService
  ) {}

  init() {
    return new Promise((resolve) => {
      this.fireAuth.auth.onAuthStateChanged(async user => {
        console.log("changing auth state", user);
        if (user) {
          this.user = user;
        } else {
          this.user = {};
        }
        resolve();
      });
    });
  }

  createUser(user, uid: string) {
    this.userDoc = this.afs.doc<User>(`users/${uid}`);
    return this.userDoc.set(user);
  }

  getAllUsers() {
    this.users = this.afs.collection<User>('users');
    return this.users.snapshotChanges().pipe(
      map(actions =>
        actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        })
      )
    );
  }

  updateUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update({role: user.role})
      .then(() =>
        this.toast.newToast({content: 'User is updated!', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error ${err}`, style: 'warning'})
      );
  }

  updateEmailVerification(uid) {
    return this.afs
      .collection('users')
      .doc(uid)
      .update({mail_verified: true});
  }

  subscribeAlbum(album) {}

  addAlbumUid(albumUid) {
    let first = false;
    let second = false;
    let third = false;
    console.log(localStorage.getItem('user_uid'));
    this.getUser(localStorage.getItem('user_uid'))
      .pipe(
        tap((user: User) => {
          console.log('user:', user.album_one_id === '');
          if (user.album_one_id === '') {
            console.log('not here');
            user.album_one_id = albumUid;
            first = true;
          } else if (user.album_two_id === '') {
            console.log('not here');
            user.album_two_id = albumUid;
            second = true;
          } else if (user.album_three_id === '') {
            console.log('not here');
            user.album_three_id = albumUid;
            third = true;
          }
          if (first && second && third) {
            console.log('not here');
            this.toast.newToast({
              content: 'You already subscribed for 3 album!',
              style: 'warning',
            });
            return;
          }
          this.updateOnlyUser(user);

          // this.imageCards
          //   .getAllCardsForAlbumUid(albumUid)
          //   .pipe(tap(item => console.log('item:', item)))
          //   .subscribe();
        })
      )
      .subscribe();
  }

  getUser(userUid) {
    return this.afs.doc<User>('users/' + userUid).valueChanges();
  }

  getProfile() {
    return new Promise(async (resolve, reject) => {
      try {
        const doc = await this.afs.collection(this.usersLocation).doc(this.user.uid).get().toPromise();
        if (doc.exists) {
          const profile = ({ ...doc.data() });
          return resolve(profile);
        } else {
          return reject("No profile found");
        }
      } catch (e) {
        console.log("Get profile failed", e);
        reject(e.message);
      }
    });
  }

  updateProfile(user) {
    return new Promise(async (resolve, reject) => {
      try {
        await this.afs.collection(this.usersLocation).doc(this.user.uid).set({ ...user }, { merge: true });
        console.log("Update profile successful");
        resolve("Update profile successful");
      } catch (e) {
        console.log("Update profile failed", e);
        reject(e.message);
      }
    });
  }

  updateOnlyUser(user) {
    return this.afs
      .collection('users')
      .doc(user.uid)
      .update(user);
  }

  getUserAlbumCards(albumUid: string, userUid: string) {
    return new Promise(async (resolve, reject) => {
      try{
        const collectionRef = await this.afs.collection('userCards');
        const snapshot = await collectionRef.ref.where('userUid', '==', userUid).where('albumUid', '==', albumUid).get();
        const cards = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(cards);
      } catch (e) {
        reject(e.message);
      }
    })
  }

  addUserCard(userCard) {
    return new Promise(async (resolve, reject) => {
      try {
        const docRef = await this.afs.collection('userCards').add({ ...userCard });
        resolve (docRef);
      } catch(e) {
        reject(e.message);
      }
    });
  }

  getUserByEmail(email: string){
    return new Promise(async (resolve, reject) => {
      try{
        const collectionRef = await this.afs.collection('users');
        const snapshot = await collectionRef.ref.where('email', '==', email).get();
        const user = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(user[0]);
      } catch(e) {
        reject(e.message);
      }
    })
  }

  getUsersByAlbum(index, albumId) {
    console.log('index', index);
    console.log('albumid', albumId);
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('users');
        let snapshot;
        if(index == 0) {
          snapshot = await collectionRef.ref.where('album_one_id', '==', albumId).get();
        } else if(index == 1) {
          snapshot = await collectionRef.ref.where('album_two_id', '==', albumId).get();
        } else if(index == 2) {
          snapshot = await collectionRef.ref.where('album_three_id', '==', albumId).get();
        }
        const users = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(users);
      } catch(e) {
        reject(e.message);
      }
    });
  }

  getUserActiveProposals(uid: string) {
    return new Promise(async (resolve, reject) => {
      try{
        const collectionRef = await this.afs.collection('cardProposal');
        const snapshot = await collectionRef.ref.where('toUser', '==', uid).get();
        const proposals = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(proposals);
      } catch(e) {
        reject(e.message);
      }
    })
  }

  getUserByUid(uid: string){
    return new Promise(async (resolve, reject) => {
      try{
        const collectionRef = await this.afs.collection('users');
        const snapshot = await collectionRef.ref.where('uid', '==', uid).get();
        const user = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(user[0]);
      } catch(e) {
        reject(e.message);
      }
    })
  }

  getUserProposalById(proposalUid: string) {
    return new Promise(async (resolve, reject) => {
      try{
        const collectionRef = await this.afs.collection('cardProposal');
        const snapshot = await collectionRef.ref.where('proposalUid', '==', proposalUid).get();
        const proposals = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        resolve(proposals[0]);
      } catch(e) {
        reject(e.message);
      }
    })
  }
}
