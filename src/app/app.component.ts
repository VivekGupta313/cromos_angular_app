import {Component, OnInit} from '@angular/core';
import {ModalService} from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'cromos';
  modalIsOpen = false;
  modalContent;
  modalData:any;
  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.modalService.modal.subscribe(modal => {
      this.modalIsOpen = modal.modalShow;
      this.modalContent = modal.modalContent;
      this.modalData = modal.modalData;
    });
  }
}
