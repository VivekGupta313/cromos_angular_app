import {Component, Input, OnInit} from '@angular/core';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() modal;
  @Input() data; //first level holder of data being passed
  constructor(
    private modalService: ModalService
  ) { }

  ngOnInit() {

  }

  closeModal() {
    this.modalService.closeModal();
  }

}
