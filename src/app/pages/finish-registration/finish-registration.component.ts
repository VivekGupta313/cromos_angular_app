import {Component, OnInit} from '@angular/core';
import {LocalStorageService} from '../../services/localStorage/local-storage.service';
import {Observable} from 'rxjs';
import {User} from 'firebase';
import {AuthService} from 'src/app/services/auth/auth.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-finish-registration',
  templateUrl: './finish-registration.component.html',
  styleUrls: ['./finish-registration.component.scss'],
})
export class FinishRegistrationComponent implements OnInit {
  user_email: string;

  user$;
  fireauth$;

  constructor(
    private localStr: LocalStorageService,
    private authService: AuthService,
    private toast: ToastService,
    private router: Router
  ) {}

  ngOnInit() {
    //  this.localStr.getStorage('user_email').subscribe(user_email => this.user_email = user_email);
    this.user$ = this.authService.user$;
    this.user$.subscribe(user => {
      // tslint:disable-next-line:curly
      if (user.emailVerified) this.router.navigateByUrl('/albums');
    });
  }

  resendMailVerification() {
    console.log('this.fireauth$:', this.fireauth$.currentUser);
    this.fireauth$.currentUser
      .sendEmailVerification()
      .then(() =>
        this.toast.newToast({content: 'Email is sent', style: 'info'})
      )
      .catch(err =>
        this.toast.newToast({
          content: 'Error during sending mail:' + err,
          style: 'warning',
        })
      );
  }
}
