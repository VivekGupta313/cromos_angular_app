import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {Group} from 'src/app/models/group';
import {GroupService} from 'src/app/services/group/group.service';
import { AuthService } from '../../services/auth/auth.service';
import {ModalService} from '../../services/modal.service';

@Component({
  selector: 'app-my-groups',
  templateUrl: './my-groups.component.html',
  styleUrls: ['./my-groups.component.scss'],
})
export class MyGroupsComponent implements OnInit {
  groups$: Observable<Group[]>;
  selected: Array<boolean>;
  nrOfGroups: number;
  joined = false;
  user: any;
  @Input() data;
  albumId: any;

  constructor(
    private groupService: GroupService, 
    private auth: AuthService,
    protected modalService: ModalService
  ) {}

  async ngOnInit() {
    this.user = await this.auth.getLoggedInUser();
    this.groups$ = await this.groupService.getGroupsForCreator(this.user.uid);
    this.groups$.subscribe(group => (this.selected = group.map(arr => false)));
    this.albumId = this.data.album.id;
  }

  confirm() {
    this.modalService.closeModal();
  }

  selectedGroup(group, index) {
    this.selected = this.selected.map(item => false);
    this.selected[index] = true;

    this.joined = this.groupService.containsUser(
      this.user.email,
      group
    );
  }
}
