export interface QuizCategory {
  id: number;
  name: string;
}

export interface QuizQuestion {
  category: string;
  type: string;
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface QuizAnswer {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface QuizSettings {
  categoryId: number;
  difficulty: string;
  amount: number;
}

export interface QuizState {
  questions: QuizQuestion[];
  currentQuestionIndex: number;
  answers: QuizAnswer[];
  isLoading: boolean;
  isComplete: boolean;
  score: number;
}

export type Difficulty = 'easy' | 'medium' | 'hard';