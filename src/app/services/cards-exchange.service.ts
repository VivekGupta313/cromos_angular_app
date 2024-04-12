import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Proposal } from 'src/app/models/proposal';

@Injectable({
  providedIn: 'root'
})
export class CardsExchangeService {

  constructor(private afsdb: AngularFirestore) { }

  addProposal(proposal : Proposal){
  	proposal.proposalUid = this.afsdb.createId();
  	return this.afsdb.collection<Proposal[]>('cardProposal')
  	.doc(proposal.proposalUid)
  	.set(proposal)
  }

  updateCard(id: string, newUserId: string) {
  	return this.afsdb.collection('userCards')
  	.doc(id)
  	.update({
  		"userUid" : newUserId
  	})
  }

  updateProposal(proposalUid: string) {
  	return this.afsdb.collection('cardProposal')
  	.doc(proposalUid)
  	.update({
  		"status" : true
  	})
  }
}
