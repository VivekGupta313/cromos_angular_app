import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Group } from '../../models/group';
import { GroupService } from 'src/app/services/group/group.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UserService } from 'src/app/services/user/user.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';
import { ToastService } from 'src/app/services/toast/toast.service';


@Component({
  	selector: 'app-join-group',
  	templateUrl: './join-group.component.html',
  	styleUrls: ['./join-group.component.scss']
})
export class JoinGroupComponent implements OnInit {
	@Input() data;
  	groups$ : Observable<Group[]>;
  	selected : Array<boolean>;
  	joined : boolean = false;
  	joinGroup : boolean = true;
  	userEmail;
  	user : any;
  	userAlbums : any = [];
  	isRegister : boolean = true;
  	albumKeyNoGroup : string = '';
    albumId: string = '';

  	constructor(
  		private groupService: GroupService,
  		private authService: AuthService,
  		private userService: UserService,
  		private router: Router,
  		private modalService: ModalService,
  		private toast: ToastService
	) { }

	ngOnInit() {
	  	this.groups$ = this.groupService.getAllAssociatedGroups(this.data.album.albumUid);
	  	this.groups$.subscribe(group => (this.selected = group.map(arr => false)));
	  	
	  	this.userEmail = this.authService.getLoggedInUser()
	  	.then(data => {
	  		console.log("data : ", data)
	  		this.userEmail = data.email;
	  	}).catch(err => {
	  		console.log("Error :", err);
	  	})

      this.albumId = this.data.album.id;

	  	this.userService.getProfile().then(profile => {
	  		this.user = profile;
	  		this.userAlbums.push(profile['album_one_id']);
	  		this.userAlbums.push(profile['album_two_id']);
	  		this.userAlbums.push(profile['album_three_id']);

	  		if(this.data.album.id == profile['album_one_id'] && profile['album_one_no_group']) {
	  			this.isRegister = false;
	  			this.albumKeyNoGroup = "album_one_no_group";
	  		} else if(this.data.album.id == profile['album_two_id'] && profile['album_two_no_group']) {
	  			this.isRegister = false;
	  			this.albumKeyNoGroup = "album_two_no_group";
	  		} else if(this.data.album.id == profile['album_three_id'] && profile['album_three_no_group']) {
	  			this.isRegister = false;
	  			this.albumKeyNoGroup = "album_three_no_group";
	  		}
	  	}).catch(err => {
	  		console.log(err);
	  	})
	}

	selectedGroup(group, index) {
	    this.selected = this.selected.map(item => false);
	    this.selected[index] = true;

	    this.joined = this.groupService.containsUser(
	      this.userEmail,
	      group
	    );
	}

    proceedNoGroup() {
			let album = this.data.album;
			console.log("join album") ; 
			console.log(album) ; 
			console.log(this.userAlbums) ; 
    	switch (album.id) {
    		case this.userAlbums[0]:
    			// update album_one
    			this.user.album_one_no_group = true;
    			break;
    		case this.userAlbums[1]:
    			// update album_one
    			this.user.album_two_no_group = true;
    			break;
    		case this.userAlbums[2]:
    			// update album_one
    			this.user.album_three_no_group = true;
    			break;
			default:		
				if(this.userAlbums[0]==="") {
					this.user.album_one_id = album.id;	
					this.user.album_one_no_group = true;
				} else if(this.userAlbums[1]==="") {
					this.user.album_two_id = album.id;	
					this.user.album_two_no_group = true;
				} else if(this.userAlbums[2]==="") {	
					this.user.album_three_id = album.id;					
					this.user.album_three_no_group = true;
				}				
    			// code...
    			break;
    	}
		console.log(this.user);
    	this.userService.updateProfile(this.user)
    	this.toast.newToast({content: 'Success', style: 'success'});
    	this.modalService.closeModal();
    }

    stopPlaying() {
		let album = this.data.album;
    	switch (album.id) {
    		case this.userAlbums[0]:
    			// update album_one
    			this.user.album_one_no_group = false;
    			break;
    		case this.userAlbums[1]:
    			// update album_one
    			this.user.album_two_no_group = false;
    			break;
    		case this.userAlbums[2]:
    			// update album_one
    			this.user.album_three_no_group = false;
    			break;
    		default:
    			// code...
    			break;
    	}

    	this.userService.updateProfile(this.user);
    	this.toast.newToast({content: 'Success', style: 'success'});
    	this.modalService.closeModal();
    }
}
