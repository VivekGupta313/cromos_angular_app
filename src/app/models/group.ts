export interface Group {
  userUid: string;
  name: string;
  users: string[];
  type: string;
  accessCode: string;
  groupUid: string;
  albumUid: string;
}

export const InitialGroup = {
  userUid: '',
  name: '',
  type: '',
  users : [],
  accessCode: '',
  groupUid: '',
  albumUid: ''
};
