export interface Question {
  collection?: string;
  question: string;
  answers: Answer[];
  questionUid?: string;
  language?: string;
  image?: string;
  level?: number;
  imageUrl?: string;
}

export const InitialQuestion: Question = {
  collection: '',
  question: '',
  answers: [
    {answer: '', correct: true},
    {answer: '', correct: false},
    {answer: '', correct: false},
    {answer: '', correct: false},
  ],
  language: '',
  level: 0,
  imageUrl: '',
};

export interface Answer {
  answer: string;
  correct: boolean;
}
