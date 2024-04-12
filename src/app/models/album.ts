import {Image} from './image';

export interface Album {
  albumUid?: string;
  collection: string;
  name: string;
  nrOfCards?: number;
  genericQuiz: boolean;
  albumImageUrl: string;
  language : string;
  level : string;
}

export const initialAlbum = {
  name: '',
  collection: '',
  nrOfCards: 0,
  albumUid: '',
  genericQuiz: true,
  albumImageUrl: '',
  language : '',
  level : ''
};
