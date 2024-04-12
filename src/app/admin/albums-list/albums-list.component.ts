import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Album} from 'src/app/models/album';
import {AlbumService} from 'src/app/services/album/album.service';
import {ColumnApi, GridApi} from 'ag-grid-community';
import {BatchService} from 'src/app/services/batch/batch.service';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-albums-list',
  templateUrl: './albums-list.component.html',
  styleUrls: ['./albums-list.component.scss'],
})
export class AlbumsListComponent implements OnInit {
  albums$: Observable<Album[]>;
  cols;
  albums: Album[];
  private api: GridApi;
  private columnApi: ColumnApi;
  constructor(
    private albumService: AlbumService,
    private batch: BatchService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.albums$ = this.albumService.getAllAlbums();
    this.albums$.subscribe(albums => (this.albums = albums));

    this.cols = [
      {
        field: 'collection',
        headerName: 'Collection',
        editable: true,
      },
      {
        field: 'name',
        headerName: 'Name',
        editable: true,
      },
      {
        field: 'language',
        headerName: 'Language',
        editable: true,
      },
      {
        field: 'genericQuiz',
        headerName: 'GenericQuiz',
        editable: true,
      },
      {
        field: 'nrOfCards',
        headerName: '#Cards',
        width: 100,
      },
      {
        headerName: 'Delete',
        editable: true,
        checkboxSelection: true,
        width: 80,
      },
    ];
  }

  onFirstDataRendered(params) {
    params.api.sizeColumnsToFit();
  }

  onGridReady(params): void {
    this.api = params.api;
    this.columnApi = params.columnApi;

    this.api.sizeColumnsToFit();
  }

  onCellValueChanged(event) {
    this.albumService.updateAlbum(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    this.api.getSelectedRows().map(rowToDelete => {
      uid = rowToDelete.albumUid;
    });
    this.albumService
      .deleteAlbum(uid)
      .then(() => {
        this.batch.deleteAlbumCards(uid);
      })
      .catch(err =>
        this.toast.newToast({content: 'Error:' + err, style: 'warning'})
      );
  }
}
