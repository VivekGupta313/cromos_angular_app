import { Component, OnInit, Input } from '@angular/core';
import { UserService } from 'src/app/services/user/user.service';
import { ModalService } from 'src/app/services/modal.service';
import { Router } from '@angular/router';
import { CardsExchangeService } from 'src/app/services/cards-exchange.service';
import { ToastService } from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-proposal-modal',
  templateUrl: './proposal-modal.component.html',
  styleUrls: ['./proposal-modal.component.scss']
})
export class ProposalModalComponent implements OnInit {
  @Input() data;
  requestor: any;
  proposal: any;
  albumId: string;
  groupId: string;

  constructor(
  	private userService: UserService,
  	private modalService: ModalService,
  	private router: Router,
    private cardsExchangeService: CardsExchangeService,
    private toastService: ToastService
  ) { }

  ngOnInit() {
  	console.log("this.data : ",this.data);
  	this.proposal = this.data.proposal;
    this.albumId = this.data.albumUid;
    this.groupId = this.data.groupId;
  	this.getRequestorName(this.proposal.fromUser);
  }

  async getRequestorName(uid: string) {
  	this.requestor = await this.userService.getUserByUid(uid);
  }

  closeModal(isAccepted) {
    if(!isAccepted) {
      this.cardsExchangeService.updateProposal(this.proposal.proposalUid)
      .then(() => {
        this.toastService.newToast({content: 'Exchange Denied', style: 'success'})
      }).catch(err => {
        this.toastService.newToast({content: `Error ${err}`, style: 'warning'})
      })
    }
  	this.modalService.closeModal();
  }

  openExchange() {
  	this.closeModal(true);
  	this.router.navigate([`cards-exchange/${this.groupId}/${this.albumId}/1/${this.proposal.proposalUid}`]);
  }

}
