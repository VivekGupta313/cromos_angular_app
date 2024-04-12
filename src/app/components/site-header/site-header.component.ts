import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router, NavigationEnd} from '@angular/router';
import {ModalService} from '../../services/modal.service';
import {LocalStorageService} from '../../services/localStorage/local-storage.service';
import {AuthService} from 'src/app/services/auth/auth.service';
import {Observable} from 'rxjs';
import {User} from '../../models/User';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-site-header',
  templateUrl: './site-header.component.html',
  styleUrls: ['./site-header.component.scss'],
})
export class SiteHeaderComponent implements OnInit {
  user_name;
  isAuth = false;
  user$: Observable<firebase.User>;
  auth$;
  user: any = {};
  isLoading: Boolean = false;
  constructor(
    public router: Router,
    private modalService: ModalService,
    private localSt: LocalStorageService,
    private userService: UserService,
    private authService: AuthService
  ) {
    // this.localSt.user_name_changed.subscribe(user_name => {
    //   this.user_name = user_name;
    //   this.isAuth = true;
    // });
    router.events.subscribe(async (val) => {
      // see also 
      let loggedIn = await this.getLoggedIn();
      if(loggedIn) {
        await this.getUser();
      } else {
        this.user = {};
      }
    });
    this.getUserName();
    this.user$ = this.authService.user$;
    this.user$.subscribe(user => console.log(user));
  }

  ngOnInit() {
    this.getUser();
  }

  // getUserName() {
  //   this.user_name = this.localSt.getStorage('user_first_name');
  //   if (this.user_name) {
  //     this.isLogened = true;
  //   }
  // }

  async getLoggedIn() {
    try {
      let user = await this.authService.getLoggedInUser();
      console.log('user', user);
      return user;
    } catch(e) {

    }
  }

  async getUser() {
    this.isLoading = true;
    try {
      this.user = await this.userService.getProfile();
      this.isLoading = false;
    } catch(e) {
      this.isLoading = false;
    }
  }

  getUserName() {
    this.localSt.getStorage('user_name').subscribe(user_name => {
      if (user_name) {
        this.user_name = user_name;
        this.isAuth = true;
      }
    });
  }

  navigateTo() {
    if (this.isAuth) {
      this.router.navigateByUrl('/albums');
    } else {
      this.router.navigateByUrl('/finish-egistration');
    }
  }

  openAuthModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'auth'},
    });
  }

  signOut() {
    this.authService.signOut().then(() => {
      this.router.navigateByUrl('');
      this.localSt.setStorage('user_name', '');
    });
  }
}

interface MenuLink {
  title: string;
  link: string;
  active: boolean;
}
