import {EventEmitter, Injectable, Output} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  @Output() modal = new EventEmitter();

  constructor() {}

  modalShow(modalContent) {
    this.modal.emit(modalContent);
  }
  closeModal() {
    this.modal.emit({modalShow: false});
  }
}
