import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  Renderer2
} from '@angular/core';
import {Collection} from '../../models/collections';
import {Album, initialAlbum} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {Observable, throwError, of} from 'rxjs';
import {CollectionService} from 'src/app/services/collection.service';
import {Language} from '../../models/language';
import {LanguageService} from 'src/app/services/language.service';
import {Level} from '../../models/level';
import {LevelService} from 'src/app/services/level.service';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask,
} from '@angular/fire/storage';
import {finalize, catchError} from 'rxjs/operators';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-new-album',
  templateUrl: './new-album.component.html',
  styleUrls: ['./new-album.component.scss'],
})
export class NewAlbumComponent implements OnInit {
  @ViewChild('dropzone') dropzone: ElementRef;
  @ViewChild('addAlbumForm') form: NgForm;

  collections$: Observable<Collection[]>;
  languages$: Observable<Language[]>;
  levels$: Observable<Level[]>;
  albumName: string;
  collection: string;
  imagesColumn;
  album: Album = initialAlbum;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  file;
  percentage: Observable<number>;
  imageIsDropped: boolean;
  isHovering: boolean;
  isSaving : boolean = false;

  constructor(
    private albumService: AlbumService,
    private toast: ToastService,
    private collectionService: CollectionService,
    private languageService: LanguageService,
    private levelService: LevelService,
    private afStorage: AngularFireStorage,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    this.languages$ = this.languageService.getAllLanguages();
    this.levels$ = this.levelService.getAllLevels();
  }

  valueChanged(event) {
    this.album.genericQuiz = event;
  }

  addAlbum() {
    if (!this.file) {
      this.toast.newToast({content: 'Please add image', style: 'warning'});
      return;
    }
    this.saveAlbum(this.file);
  }

  getFile(event : FileList) {
    this.file = event.item(0);
    if (this.file.type.split('/')[0] !== 'image') {
      this.toast.newToast({
        content: 'File type is unsuported',
        style: 'warning',
      });
      this.file = null;
      return;
    }
    this.imageIsDropped = true;
  }

  saveAlbum(file){
    this.isSaving = true;
    const path = `albumImages/${file.name}`;
    const fileRef = this.afStorage.ref(path);
    const task = this.afStorage.upload(path, file);
    this.percentage = task.percentageChanges();

    task.snapshotChanges().pipe(
      finalize(()=> {
        fileRef.getDownloadURL().subscribe(url => {
          this.album.albumImageUrl = url;
          this.albumService
            .addNewAlbum(this.album)
            .then(() => {
              this.isSaving = false;
              this.percentage = of(null);
              this.formReset();
              this.renderer.removeStyle(
                this.dropzone.nativeElement,
                'backgroundImage'
              );
              this.toast.newToast({
                content: 'Album is added',
                style: 'success',
              });
            })
            .catch(err => {
                this.isSaving = false;
                this.toast.newToast({
                  content: `There was problem:${err}`,
                  style: 'warning',
                })
              }
            );
        })
      }),
      catchError(err => {
        this.toast.newToast({content: `Error${err.name}`, style: 'warning'});
        return throwError(err);
      })
    )
    .subscribe();
  }

  toggleHover(event: boolean) {
    this.isHovering = event;
  }

  formReset() {
    this.form.form.reset();
  }
}
