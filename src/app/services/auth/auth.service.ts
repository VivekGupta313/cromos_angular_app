import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import {Response} from '@angular/http';
import {Observable, of} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {LocalStorageService} from '../localStorage/local-storage.service';

import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import {AngularFireAuth} from '@angular/fire/auth';
import {User} from '../../models/User';
import {Credentials} from '../../models/credentials';
import { UserService } from '../user/user.service';
import * as firebase from 'firebase/app';
import { Album } from '../../models/album';
import { AlbumService } from '../album/album.service';

const API_URL = environment.apiUrl;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$: Observable<firebase.User>;
  auth$;
  private user: any = {};
  constructor(
    private http: HttpClient,
    private localStr: LocalStorageService,
    private afs: AngularFirestore,
    private userService: UserService,
    private albumService: AlbumService,
    private afAuth: AngularFireAuth
  ) {
    // this.auth$ = this.afAuth.auth;
    // check if user is logged and return user or null
    this.user$ = this.afAuth.authState;
    // .pipe(
    //   switchMap(user => {
    //     console.log('user:', user);
    //     if (user) {
    //       return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
    //     } else {
    //       return of(null);
    //     }
    //   })
    // );
  }

  getAuthState() {
    return this.afAuth.auth;
  }

  registerWithEmail(credentials: Credentials) {
    return this.afAuth.auth.createUserWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  loginWithEmail(credentials: Credentials) {
    return this.afAuth.auth.signInWithEmailAndPassword(
      credentials.email,
      credentials.password
    );
  }

  loginWithFacebook() {
    return new Promise(async (resolve, reject) => {
      try {
        let response: any = await this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());
        // check if has profile, if none create it
        try {
          await this.userService.getProfile();
        } catch (e) {
          if (e == "No profile found") {
            let user = {
              first_name: response.additionalUserInfo.profile.first_name,
              last_name: response.additionalUserInfo.profile.last_name,
              email: response.additionalUserInfo.profile.email,
              photoUrl: response.additionalUserInfo.profile.picture.data.url,
              mail_verified: true,
              album_one_id: '',
              album_two_id: '',
              album_three_id: '',
              role: 'user',              
              album_one_lastVisit: 0,
              album_two_lastVisit: 0,
              album_three_lastVisit: 0,
              album_one_points: 0,
              album_two_points: 0,
              album_three_points: 0
            };
            await this.userService.updateProfile(user);
          }
        }
        resolve(response.user);
      } catch (e) {
        console.log("Login failed", e);
        reject(e.message);
      }
    });
  }

  async createUserProfileFromProvider(providerData) {
    try {
      let picture = providerData.picture || providerData.photoURL;
      // if picture is an object, this came from facebook then
      // retrieve the inner values
      if(typeof picture === "object" && picture !== null){
        picture = picture.data.url;
      }
  
      return ({
        first_name: providerData.given_name || providerData.first_name,
        last_name: providerData.family_name || providerData.last_name,
        email: providerData.email,
        photoUrl: picture,
        mail_verified: true,
        role: 'user',
        album_one_id: '',
        album_two_id: '',
        album_three_id: '',
        album_one_lastVisit: 0,
        album_two_lastVisit: 0,
        album_three_lastVisit: 0,
        album_one_points: 0,
        album_two_points: 0,
        album_three_points: 0,
        album_one_no_group : false,
        album_two_no_group : false,
        album_three_no_group : false
      });
    } catch(e) {
      console.log('e', e);
    }
  }

  getLoggedInUser(): Promise<firebase.User> {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.onAuthStateChanged(async user => {
        if (user) {
          resolve(user);
        } else {
          reject(null);
        }
      });
    });
  }

  // facebookLogin() {
  //   const provider = new auth.FacebookAuthProvider();
  //   return this.oAuthLogin(provider);
  // }

  // oAuthLogin(provider) {
  //   return this.afAuth.auth
  //     .signInWithPopup(provider)
  //     .then(credential => {
  //       this.updateUserData(credential.user);
  //     })
  //     .catch(err => console.error('error during facebook login:', err));
  // }

  signOut() {
    return this.afAuth.auth.signOut();
  }

  // signIn(user) {
  //   return this.http
  //     .post(API_URL + 'customer/login/', {
  //       email: user.user_email,
  //       password: user.user_password,
  //     })
  //     .pipe();
  // }

  // getUserName(userId, userToken): any {
  //   return this.http
  //     .get(API_URL + 'customer/' + userId, {params: {access_token: userToken}})
  //     .pipe();
  // }

  signUp(user) {
    user.emailVerified = false;
    return this.http.post(API_URL + 'customer', user).pipe();
  }

  // handleError (error: Response | any) {
  //   console.error('ApiService::handleError', error);
  //   return Observable.throwError(error);
  // }

  // confirmEmail(userData) {
  //   return this.http
  //     .get(API_URL + 'customer/confirm', {params: userData})
  //     .pipe();
  // }
}
