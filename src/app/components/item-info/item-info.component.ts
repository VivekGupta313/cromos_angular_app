import {Component, OnInit, Input} from '@angular/core';
import {Group} from '../../models/group';
import {User} from '../../models/User';
import {AuthService} from 'src/app/services/auth/auth.service';
import {GroupService} from 'src/app/services/group/group.service';
import {ToastService} from 'src/app/services/toast/toast.service';
import {UserService} from 'src/app/services/user/user.service';

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss'],
})
export class ItemInfoComponent implements OnInit {
  closed = true;
  userEmail: any;
  accessCode: string;
  @Input() joined: boolean;
  @Input() private: boolean;
  @Input() joinGroup: boolean;
  @Input() selected: boolean;
  @Input() group: Group;
  @Input() albumId: string;

  user: any;
  userAlbums: any = [];
  isRegister: boolean = false;
  albumKeyGroup: string = '';
  albumEmptyIdx : number;

  constructor(
  	private authService: AuthService,
  	private groupService: GroupService,
  	private toastService: ToastService,
  	private userService: UserService
  ) {}

  ngOnInit() {
  	this.userEmail = this.authService.getLoggedInUser()
  	.then(userLogin => {
  		this.userEmail = userLogin.email;
  	});

  	this.userService.getProfile().then(profile => {
  		this.user = profile;
  		this.userAlbums.push(profile['album_one_id']);
  		this.userAlbums.push(profile['album_two_id']);
  		this.userAlbums.push(profile['album_three_id']);

  		if(this.albumId == profile['album_one_id']) {
  			this.isRegister = false;
  			this.albumKeyGroup = "album_one_id";
  		} else if(this.albumId == profile['album_two_id']) {
  			this.isRegister = false;
  			this.albumKeyGroup = "album_two_id";
  		} else if(this.albumId == profile['album_three_id']) {
  			this.isRegister = false;
  			this.albumKeyGroup = "album_three_id";
  		}

      this.albumEmptyIdx = this.userAlbums.indexOf("");
  	}).catch(err => {
  		console.log(err);
  	})
  }

  register() {
  	console.log("joined : ", this.joined);

  	if(!this.joined && this.selected) {
	  	if(!this.private)
	  	{
	  		this.group.users.push(this.userEmail);
	  		this.groupService.joinGroup(this.group)
	  		.then(() => {
          this.updateProfile(true)
	  			this.closed = !this.closed;
	  			this.toastService.newToast({
	  				content: 'You are now registered',
	          		style: 'success'
	  			})
	  		}).catch(err => {
	  			this.closed = !this.closed;
	  			this.toastService.newToast({
	  				content: `Error:${err}`, 
	  				style: 'warning'
	  			})
	  		})
	  	} else {
	  		console.log("this.accessCode : ", this.accessCode);
	  		if(this.accessCode == this.group.accessCode) {
	  			this.group.users.push(this.userEmail);
	  			this.groupService.joinGroup(this.group)
	  			.then(() => {
            this.updateProfile(true);
	  				this.selected = false;
	  				this.closed = !this.closed;
		  			this.toastService.newToast({
		  				content: 'You are now registered',
		          		style: 'success'
	  				})
	  			}).catch(err => {
	  				this.selected = false;
	  				this.closed = !this.closed;
	  				this.toastService.newToast({
		  				content: `Error:${err}`, 
		  				style: 'warning'
		  			})
	  			})
	  		} else {
		  		this.toastService.newToast({
					content: 'Invalid access code.', 
					style: 'danger'
				})
	  		}
	  	}
  	} else {
  		this.selected = false;
  		this.closed = !this.closed;
  		this.toastService.newToast({
			content: 'You are already part of this group.', 
			style: 'warning'
		})
  	}
  }

  confirm() {
  	this.groupService.unregister(this.group, this.userEmail)
  	.then(() => {
      this.updateProfile(false);
  		this.selected = false;
  		this.closed = !this.closed;
  		this.toastService.newToast({
  			content: 'Unregister succesful.',
    		style: 'success'
  		})
  	}).catch(err => {
  		this.selected = false;
  		this.closed = !this.closed;
  		this.toastService.newToast({
  			content: `Error:${err}`, 
  			style: 'warning'
  		})
  	})
  }

  cancel() {
  	this.closed = !this.closed;
  }

  updateProfile(isRegister) {
    if(isRegister) {
      switch(this.albumEmptyIdx) {
        case 0 : 
          this.user.album_one_id = this.albumId;
          break;
        case 1 :
          this.user.album_two_id = this.albumId;
          break;
        case 2 :
          this.user.album_three_id = this.albumId;
          break;
        default : 
          break;  
      }
    } else {
      this.user[this.albumKeyGroup] = '';
    }

    this.userService.updateProfile(this.user);
  }
}
