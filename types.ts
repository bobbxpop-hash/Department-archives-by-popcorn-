
export interface Note {
  id: string;
  title: string;
  subject: string;
  content: string; // Simulated content for quiz generation
  type: 'pdf' | 'text';
  date: string;
}

export interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Quiz {
  title: string;
  questions: Question[];
}

export enum AppState {
  INTRO = 'INTRO',
  DASHBOARD = 'DASHBOARD',
  QUIZ = 'QUIZ',
  VIEWER = 'VIEWER'
}
