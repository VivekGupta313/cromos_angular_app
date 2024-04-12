export interface User {
  uid: string;
  email: string;
  photoURL?: string;
  displayName?: string;
  role?: string;
  first_name: string;
  last_name: string;
  mail_verified: boolean;
  album_one_id?: string;
  album_two_id?: string;
  album_three_id?: string;
  album_one_lastVisit: Number;
  album_two_lastVisit: Number;
  album_three_lastVisit: Number;
  album_one_points: Number;
  album_two_points: Number;
  album_three_points: Number;
  album_one_no_group : boolean;
  album_two_no_group : boolean;
  album_three_no_group : boolean;
}


export interface UserAlbum {
  userAlbumUid: string;
}
