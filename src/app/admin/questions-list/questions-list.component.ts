import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Question} from 'src/app/models/question';
import {QuestionService} from 'src/app/services/question/question.service';
import {mergeAll, flatMap, tap, map} from 'rxjs/operators';
import {Key} from 'protractor';
import {CardRendererComponent} from '../manage-images/card-renderer.component';

@Component({
  selector: 'app-questions-list',
  templateUrl: './questions-list.component.html',
  styleUrls: ['./questions-list.component.css'],
})
export class QuestionsListComponent implements OnInit {
  questions$: Observable<any[]>;
  cols;
  api;
  columnApi;

  constructor(private questionsService: QuestionService) {}

  ngOnInit() {
    this.questions$ = this.questionsService.getAllQuestions().pipe(
      map(items =>
        items.map(item => {
          return {
            collection: item.collection,
            question: item.question,
            level: item.level,
            language: item.language,
            questionUid: item.questionUid,
            imageUrl: item.imageUrl,
            answers0: item.answers[0].answer,
            answers1: item.answers[1].answer,
            answers2: item.answers[2].answer,
            answers3: item.answers[3].answer,
          };
        })
      )
    );

    this.cols = [
      {
        field: 'collection',
        headerName: 'Collection',
        width: 130,
      },
      {
        field: 'level',
        headerName: 'Level',
        width: 100,
      },
      {
        field: 'language',
        headerName: 'Language',
        width: 100,
      },
      {
        field: 'question',
        headerName: 'Question',
        editable: true,
        width: 250,
      },
      {
        field: 'answers0',
        headerName: 'Answer 1',
        editable: true,
        width: 120,
      },
      {
        field: 'answers1',
        headerName: 'Answer 2',
        editable: true,
        width: 120,
      },
      {
        field: 'answers2',
        headerName: 'Answer 3',
        editable: true,
        width: 120,
      },
      {
        field: 'answers3',
        headerName: 'Answer 4',
        editable: true,
        width: 120,
      },
      {
        field: 'imageUrl',
        headerName: 'Photo',
        cellRendererFramework: CardRendererComponent,
        autoHeight: true,
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
    this.questionsService.updateQuestion(event.data);
    // window.alert('Development is ongoing');
  }

  rowsSelected() {
    return this.api && this.api.getSelectedRows().length > 0;
  }

  deleteSelectedRows() {
    let uid: string;
    const deleteSubscriptions = this.api.getSelectedRows().map(rowToDelete => {
      uid = rowToDelete.questionUid;
    });
    this.questionsService.deleteQuestion(uid);
  }
}
