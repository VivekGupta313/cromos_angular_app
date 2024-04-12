import {Component, OnInit, Input} from '@angular/core';
import {ModalService} from 'src/app/services/modal.service';
import { QuestionService } from '../../services/question/question.service';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image/image.service';
import { UserCard } from '../../models/usercards';
import { UserService } from '../../services/user/user.service';

@Component({
  selector: 'app-trivia-second',
  templateUrl: './trivia-second.component.html',
  styleUrls: ['./trivia-second.component.scss'],
})
export class TriviaSecondComponent implements OnInit {
  @Input() data;
  questionObj: any = {};
  question = 'CUÁL ES LA PRINCIPAL AGROINDUSTRI DE TODA EUROPA?';
  // tslint:disable-next-line:max-line-length
  image =
    'https://firebasestorage.googleapis.com/v0/b/chromos-cc861.appspot.com/o/questions%2Fmissing_image.png?alt=media&token=c1ebc926-47f3-4ab9-9d18-6092ca111c18';


  chosenAnswer: any;
  answers: any = [];
  hasAnswered: Boolean = false;
  cards: any = [];
  constructor(private modalService: ModalService, 
    private router: Router,
    private userService: UserService,
    private imageService: ImageService,
    private questionService: QuestionService) {}

  ngOnInit() {
    this.getTwoCards();
    this.getRandomQuestion();
  }

  openModal(modalType) {
    this.modalService.modalShow({
      modalShow: true,
      modalContent: {modalType: modalType},
    });
  }

  async chooseAnswer(answer) {
    try {
      console.log("Answer",answer);
      if(!this.hasAnswered) {
        this.hasAnswered = true;
        this.chosenAnswer = answer;
       
        if(this.chosenAnswer.correct) {
          let user = await this.userService.getProfile();
          if(this.data.albumUid == user['album_one_id']){
            user['album_one_points'] += 1;
          } else if(this.data.albumUid == user['album_two_id']){
            user['album_two_points'] += 1;
          } else if(this.data.albumUid == user['album_three_id']){
            user['album_three_points'] += 1;
          }
          await this.userService.updateProfile(user);
          this.cards.map(async(card) => {
            let cardObj:UserCard = {
              imageUrl: card.url,
              receivedDate: new Date().getTime(),
              albumUid: this.data.albumUid,
              userUid: user['uid'],
              cardNumber: card.nrOfCard,
              title: card.title,
              imageUId: card.imageUid,
              isDragged: false,
              description: card.description
            };
            await this.userService.addUserCard(cardObj);
          })
        }
      }
    } catch(e) {
    }
  }

  goToAlbum() {
    this.modalService.closeModal();
    this.router.navigate(['/album/' + this.data.albumUid]);
  }

  async getRandomQuestion() {
    try {
      console.log("data collection ",this.data);
      let questions = await this.questionService.getQuestionFromCollection(this.data.collection,this.data.genericQuiz);
      //
      questions.forEach(element => {
        if(element.answers[0].correct==false || element.answers[0].correct =="" ){
         //let temp.a
          // element.answers[0].correct = true;
          // element.answers[1].correct = false;
          // element.answers[2].correct = false;
          // element.answers[3].correct = false;
          console.log("element",element);
          //let ans = this.questionService.updateCardNumber(element);
         //console.log("ans",ans);
        }else{
          console.log("no record found");
        }
      }); 
      this.questionObj = this.questionService.getRandomQuestion(questions, 1)[0];
      console.log("question",this.questionObj);
      this.answers = this.shuffleAnswers(this.questionObj.answers);
    } catch(e) {
    }
  }

  async getTwoCards() {
    try {
      this.cards = await this.imageService.list();
      this.cards = this.imageService.getRandomImages(this.cards, 2);
      this.cards = this.cards.map(card => {
        card.nrOfCard = Math.floor((Math.random() * 100) + 1);
        return card;
      })
    } catch(e) {
      
    }
  }

  shuffleAnswers(answers) {
    const shuffled = answers.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 4);
  }
}
