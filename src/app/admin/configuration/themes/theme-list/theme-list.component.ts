import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Theme} from 'src/app/models/theme';
import {ThemeService} from 'src/app/services/theme.service';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-theme-list',
  templateUrl: './theme-list.component.html',
  styleUrls: ['./theme-list.component.scss'],
})
export class ThemeListComponent implements OnInit {
  themes$: Observable<Theme[]>;
  theme: any;

  api;
  columnApi;
  cols;

  constructor(
    private themeService: ThemeService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.themes$ = this.themeService.getAllThemes();
    // this.languages$.subscribe(albums => (this.albums = albums));

    this.cols = [
      {
        field: 'theme',
        headerName: 'Theme',
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
    this.themeService.updateThemes(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    this.api.getSelectedRows().map(rowToDelete => {
      uid = rowToDelete.themeUid;
    });
    this.themeService.deleteTheme(uid);
  }
}
