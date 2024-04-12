import {Injectable} from '@angular/core';
import {Subject, BehaviorSubject, Observable, of} from 'rxjs';
import {Album, initialAlbum} from 'src/app/models/album';
import {Image, initialImage} from 'src/app/models/image';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor() {}

  private albumSource = new BehaviorSubject<Album>(initialAlbum);
  currentAlbum = this.albumSource.asObservable();

  private albumsSource = new BehaviorSubject<Album[]>(null);
  currentAlbums = this.albumsSource.asObservable();

  private imageSource = new BehaviorSubject<Image[]>([initialImage]);
  currentImages = this.imageSource.asObservable();

  changeAlbum(album: Album) {
    this.albumSource.next(album);
  }

  changeAlbums(albums: Album[]) {
    this.albumsSource.next(albums);
  }

  changeImage(images: Image[]) {
    this.imageSource.next(images);
  }


}
