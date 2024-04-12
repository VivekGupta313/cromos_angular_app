import { OnInit, Input, Component } from "@angular/core";
import { AlbumcardsService } from "../../services/albumcards/albumcards.service";
import { t } from "@angular/core/src/render3";

@Component({
    selector: 'app-temario',
    templateUrl: './temario.component.html',
    styleUrls: ['./temario.component.scss']
})
export class TemarioComponent implements OnInit {
    // tslint:disable-next-line:max-line-length
    @Input() data;
    albumCards: any = [];

    constructor(private albumCardsService: AlbumcardsService) {

    }

    async ngOnInit() {
        await this.getAlbumCards();
    }
    
    async getAlbumCards() {
        try {
          let albumCardsCopy = await this.albumCardsService.list(this.data.albumId);
          console.log('albumCards', this.albumCards);
          
          for(let i = 0 ; i < albumCardsCopy.length ; i++){
                let found = false ; 
                
                for(let j = 0 ; j < this.albumCards.length ; j++){
                    //console.log(this.albumCards[j].id+" "+albumCardsCopy[i].id+" "+(this.albumCards[j].id == albumCardsCopy[i].id)) ; 
                    if(this.albumCards[j].nrOfCard == albumCardsCopy[i].nrOfCard){
                        found = true ; 
                        break ; 
                    }
                }
                if(!found){
                    this.albumCards.push(albumCardsCopy[i]) ; 
                }
          }
        } catch(e) {
          
        }
    }

  }