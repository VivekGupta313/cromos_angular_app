import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {User} from 'src/app/models/User';
import {UserService} from 'src/app/services/user/user.service';
import { GridApi, ColumnApi } from 'ag-grid-community';
import { windowWhen } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
  users$: Observable<User[]>;
  cols;
  users: User[];
  private api: GridApi;
  private columnApi: ColumnApi;

  constructor(private userService: UserService) {}

  ngOnInit() {

    this.users$ = this.userService.getAllUsers();
    this.cols = [
      {
        field: 'name',
        headerName: 'Firstname',
      },
      {
        field: 'name',
        headerName: 'Lastname',
      },
      {
        field: 'email',
        headerName: 'email',
        width: 100,
      },
      {
        field: 'role',
        headerName: 'Role',
        editable: true,
        width: 80,
      },
      {
        headerName: 'Delete',
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
    this.userService.updateUser(event.data);
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    window.alert('Development is ongoing');
}


}
