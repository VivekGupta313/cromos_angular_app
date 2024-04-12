export interface Image {
  imageUid: string;
  title: string;
  description: string;
  url: string;
  collection: string;
  theme: string;
  imgName: string;
  language: string;
  level: string;
}

export const initialImage = {
  imageUid: '',
  title: '',
  description: '',
  url: '',
  collection: '',
  theme: '',
  imgName: '',
  language: '',
  level: '',
};

export const dummyImage = {
  imageUid: '',
  title: '',
  description: '',
  url: '../../assets/img/missing_image.png',
  collection: '',
  imgName: '',
  language: '',
  level: '',
};
