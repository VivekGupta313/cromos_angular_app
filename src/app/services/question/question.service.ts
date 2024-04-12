import {Injectable} from '@angular/core';
import {
  AngularFirestoreCollection,
  AngularFirestore,
} from '@angular/fire/firestore';
import {Question} from 'src/app/models/question';
import {ToastService} from '../../services/toast/toast.service';

@Injectable({
  providedIn: 'root',
})
export class QuestionService {
  question: AngularFirestoreCollection<Question>;
  constructor(private afs: AngularFirestore, private toast: ToastService) {}

  addQuestion(question) {
    question.questionUid = this.afs.createId();
    return this.afs
      .collection<Question>('questions')
      .doc(question.questionUid)
      .set(question);
  }

  getAllQuestions() {
    return this.afs.collection<Question>('questions').valueChanges();
  }

  convertQuestionFormat(question) {
    return (question = {
      collection: question.collection,
      question: question.question,
      questionUid: question.questionUid,
      answers: [
        {answer: question.answers0, correct: true},
        {answer: question.answers1, correct: false},
        {answer: question.answers2, correct: false},
        {answer: question.answers3, correct: false},
      ],
    });
  }

  getQuestionFromCollection(collection,genericQuiz):Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const collectionRef = await this.afs.collection('questions');
        let snapshot;
        if(!genericQuiz){
          snapshot = await collectionRef.ref.where('collection', '==', collection).get();
        }else{
           snapshot = await collectionRef.ref.get();
        }
        const questions = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        console.log("question service",questions);
        resolve(questions);
      } catch(e) {
        reject(e);
      }
    })
  }

  getRandomQuestion(questions: any[], n) {
    const shuffled = questions.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  }
  updateCardNumber(question) {
    return this.afs
      .collection('questions')
      .doc(question.questionUid)
      .update(question);
  }
  updateQuestion(question) {
    return this.afs
      .collection('questions')
      .doc(question.questionUid)
      .update(this.convertQuestionFormat(question))
      .then(() =>
        this.toast.newToast({content: 'Question is updated', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }

  deleteQuestion(uid) {
    return this.afs
      .collection('questions')
      .doc(uid)
      .delete()
      .then(() =>
        this.toast.newToast({content: 'Question is deleted', style: 'success'})
      )
      .catch(err =>
        this.toast.newToast({content: `Error:${err}`, style: 'warning'})
      );
  }
}
