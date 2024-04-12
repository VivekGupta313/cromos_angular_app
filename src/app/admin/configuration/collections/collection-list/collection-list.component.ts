import {Component, OnInit} from '@angular/core';
import {Collection} from 'src/app/models/collections';
import {Observable} from 'rxjs';
import {CollectionService} from 'src/app/services/collection.service';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  collections$: Observable<Collection[]>;

  cols;
  api;
  columnApi;

  constructor(
    private collectionService: CollectionService,
    private toast: ToastService
  ) {}
  ngOnInit() {
    this.collections$ = this.collectionService.getAllCollections();
    // this.languages$.subscribe(albums => (this.albums = albums));

    this.cols = [
      {
        field: 'collection',
        headerName: 'Collection',
        editable: true,
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
    this.collectionService.updateCollection(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    this.api.getSelectedRows().map((rowToDelete: Collection) => {
      uid = rowToDelete.collectionUid;
    });
    this.collectionService
      .deleteCollection(uid)
      .then(() => {
        // this.batch.deleteAlbumCards(uid);
      })
      .catch(err =>
        this.toast.newToast({content: 'Error:' + err, style: 'warning'})
      );
  }
}
