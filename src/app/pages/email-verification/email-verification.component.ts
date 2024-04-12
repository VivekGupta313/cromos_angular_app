import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import {AuthService} from '../../services/auth/auth.service';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-email-verification',
  templateUrl: './email-verification.component.html',
  styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent implements OnInit {
  emailVerified: boolean;
  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      const userData = {
        uid: params['uid'],
        token: params['token'],
      };
      // if (userData.uid) {
      //   this.authService.confirmEmail(userData).subscribe(() => {
      //     this.emailVerified = true;
      //   });
      // }
    });
  }

  openModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'auth'},
    });
  }
}
