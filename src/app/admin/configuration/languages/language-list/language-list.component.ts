import {Component, OnInit} from '@angular/core';
import {LanguageService} from 'src/app/services/language.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {Language} from 'src/app/models/language';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-language-list',
  templateUrl: './language-list.component.html',
  styleUrls: ['./language-list.component.scss'],
})
export class LanguageListComponent implements OnInit {
  languages$: Observable<Language[]>;
  cols;
  api;
  columnApi;

  constructor(
    private languageService: LanguageService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.languages$ = this.languageService.getAllLanguages();
    // this.languages$.subscribe(albums => (this.albums = albums));

    this.cols = [
      {
        field: 'language',
        headerName: 'Language',
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
    this.languageService.updateLanguage(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    this.api.getSelectedRows().map(rowToDelete => {
      uid = rowToDelete.languageUid;
    });
    this.languageService
      .deleteLanguage(uid)
      .then(() => {
        // this.batch.deleteAlbumCards(uid);
      })
      .catch(err =>
        this.toast.newToast({content: 'Error:' + err, style: 'warning'})
      );
  }
}
