import {Component, OnInit} from '@angular/core';
import {DataService} from 'src/app/services/data/data.service';
import {Album} from 'src/app/models/album';
import {Observable} from 'rxjs';
import {ModalService} from '../../services/modal.service';
import {Image} from 'src/app/models/image';
import {ImageService} from 'src/app/services/image/image.service';
import {Router, ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Group} from 'src/app/models/group';
import {GroupService} from '../../services/group/group.service';
import {AuthService} from '../../services/auth/auth.service';
import { AlbumService } from '../../services/album/album.service';
import {UserService} from 'src/app/services/user/user.service';
import {_} from 'underscore';

@Component({
  selector: 'app-album-single',
  templateUrl: './album-single.component.html',
  styleUrls: ['./album-single.component.scss'],
})
export class AlbumSingleComponent implements OnInit {
  album$: Observable<Album>;
  albumSingle: any = {};
  rndImage: Image;
  myGroups: any = [];
  userEmail: string;
  userIsRegistered: boolean;
  albumId: any;
  currentGroupId: any;
  proposals: any;
  user: any;
  userAlbums: any = {};
  allowNoGroup: boolean = false;

  constructor(
    private dataService: DataService,
    private modalService: ModalService,
    private imageService: ImageService,
    private router: Router,
    private albumService: AlbumService,
    private groupService: GroupService,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private userService: UserService
  ) {
    this.albumId = this.activatedRoute.snapshot.params['id'];
  }

  ngOnInit() {
    // this.dataService.currentAlbum.subscribe(album => {
    //   this.albumSingle = album;
    // });
    // this.dataService.currentImages.subscribe(
    //   image => (this.rndImage = image[0])
    // );

    //Get User Details
    this.authService.getLoggedInUser()
    .then(data => {
      this.getAlbum(data.uid);
      this.userEmail = data.email;
    })

    this.userService.getProfile().then(profile => {
      this.user = profile;
      this.userAlbums[profile['album_one_id']] = profile['album_one_no_group'];
      this.userAlbums[profile['album_two_id']] = profile['album_two_no_group'];
      this.userAlbums[profile['album_three_id']] = profile['album_three_no_group'];

      this.allowNoGroup = this.userAlbums[this.albumId];

    }).catch(err => {
      console.log(err);
    })
  }

  openTemario() {
    this.modalService.modalShow({
      modalShow: true,
      modalData: {
        albumId: this.albumId
      },
      modalContent: {modalType: 'temario'}
    });
  }

  async getAlbum(uid) {
    try {
      this.albumSingle = await this.albumService.getAlbumItem(this.albumId);
      console.log('album', this.albumSingle);
      this.groupService.getGroupsForUser(this.userEmail)
      .subscribe(groups => {
        this.myGroups = groups;
        this.myGroups.forEach(group => {
          if(group.albumUid == this.albumSingle.albumUid) {
            if(group.users.indexOf(this.userEmail) > -1){
              this.userIsRegistered = true;
              this.currentGroupId = group.groupUid;
              this.getMyActiveProposals(uid);
            }
          }
        })
      })
    } catch(e) {

    }
  }

  openAlbum(album: Album) {
    if(this.userIsRegistered || this.allowNoGroup) {
      this.dataService.changeAlbum(album);
      this.router.navigate([`album/${album.albumUid}/opened`]);
    }
  }

  openGroupModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'join_group'},
      modalData : {album : this.albumSingle}
    });
  }

  openMyGroupsModal() {

    //this.groupService.unregister()
    this.groupService.getAllAssociatedGroups(this.albumId).subscribe(
      (groups: Group[]) => {
        console.log("group is ") ; 
        console.log(groups) ;
        for(let i = 0 ; i < groups.length ; i++ ){
          for(let j = 0 ; j < groups[i].users.length ; j++ ){
            if(this.userEmail == groups[i].users[j]){
              console.log("group found for user "+this.userEmail) ; 
              console.log(groups[i]) ; 
              this.groupService.unregister(groups[i] , this.userEmail) ; 
              break ; 
            }
          }
        }
      }
    );


      /*
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'my_groups'},
      modalData : {album : this.albumSingle}
    }); */
  }

  openSubscriptionModal() {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'album_subscription'},
    });
  }

  goToExchange() {
    this.router.navigate([`cards-exchange/${this.currentGroupId}/${this.albumSingle.albumUid}/0/0`]);
  }

  goToAlbumOverview(albumUid: string) {
    this.router.navigate([`album-overview/${this.currentGroupId}/${albumUid}`]);
  }

  goToRanking() {
    this.router.navigateByUrl('ranking/' + this.albumSingle.albumUid);
  }

  openProposal(proposal: any){
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: 'proposals_modal'},
      modalData : {
        proposal : proposal,
        groupId : this.currentGroupId,
        albumUid : this.albumSingle.albumUid
      }
    });
  }

  async getMyActiveProposals(uid: string){
    this.proposals = await this.userService.getUserActiveProposals(uid);
    let props: any = [];
    _.each(this.proposals, proposal => {
      if(proposal.status == false) {
        props.push(proposal);
      }
    });
    this.proposals = props;
    console.log("this.props : ", props);
    if(this.proposals.length > 0) {
      this.openProposal(this.proposals[0]);
    }
  }

}
