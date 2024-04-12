import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {Level} from 'src/app/models/level';
import {LevelService} from 'src/app/services/level.service';
import {ToastService} from 'src/app/services/toast/toast.service';

@Component({
  selector: 'app-level-list',
  templateUrl: './level-list.component.html',
  styleUrls: ['./level-list.component.scss'],
})
export class LevelListComponent implements OnInit {
  levels$: Observable<Level[]>;
  level: any;

  api;
  columnApi;
  cols;

  constructor(
    private levelService: LevelService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.levels$ = this.levelService.getAllLevels();
    // this.languages$.subscribe(albums => (this.albums = albums));

    this.cols = [
      {
        field: 'level',
        headerName: 'Level',
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
    this.levelService.updateLevels(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    this.api.getSelectedRows().map(rowToDelete => {
      uid = rowToDelete.levelUid;
    });
    this.levelService.deleteLevel(uid);
  }
}
