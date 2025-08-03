import { QuizQuestion } from '../types/quiz';

export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export const decodeHtml = (html: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

export const getShuffledAnswers = (question: QuizQuestion): string[] => {
  const allAnswers = [...question.incorrect_answers, question.correct_answer];
  return shuffleArray(allAnswers.map(decodeHtml));
};

export const calculateScorePercentage = (correct: number, total: number): number => {
  return Math.round((correct / total) * 100);
};

export const getScoreColor = (percentage: number): string => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-red-600';
};

export const getPerformanceMessage = (percentage: number): string => {
  if (percentage >= 90) return 'Outstanding! 🌟';
  if (percentage >= 80) return 'Excellent work! 🎉';
  if (percentage >= 70) return 'Great job! 👏';
  if (percentage >= 60) return 'Good effort! 👍';
  if (percentage >= 50) return 'Not bad! 🙂';
  return 'Keep practicing! 💪';
};