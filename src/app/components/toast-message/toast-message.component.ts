import {Component, OnInit} from '@angular/core';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-toast-message',
  templateUrl: './toast-message.component.html',
  styleUrls: ['./toast-message.component.scss'],
})
export class ToastMessageComponent implements OnInit {
  constructor(private toast: ToastService) {}

  message: any;
  showToast = false;
  ngOnInit() {
    this.toast.getToast().subscribe(toast => {
      if (!toast) {
        this.message = '';
      } else {
        this.message = toast;
        this.showToast = true;
        setTimeout(() => {
          this.showToast = false;
        }, 3000);
      }
    });
  }

  // dismiss() {
  //   this.toast.deleteToast();
  // }
}
