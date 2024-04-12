export interface Proposal {
  proposalUid: string,
  groupUid: string,
  albumUid: string,
  fromUser: string,
  toUser: string,
  cardNo: string,
  status: boolean,
  type: string,
  cardForDeal: any
}

export const initialProposal = {
  proposalUid: '',
  groupUid: '',
  albumUid: '',
  fromUser: '',
  toUser: '',
  cardNo: '',
  status: false,
  type: '',
  cardForDeal: []
};
