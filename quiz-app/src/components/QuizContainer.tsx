import React, { useState, useEffect } from 'react';
import { QuizQuestion as QuizQuestionType, QuizAnswer, QuizSettings } from '../types/quiz';
import { fetchQuizQuestions } from '../services/quizApi';
import { decodeHtml } from '../utils/quizHelpers';
import QuizQuestion from './QuizQuestion';
import ScoreDisplay from './ScoreDisplay';
import LoadingSpinner from './LoadingSpinner';

interface QuizContainerProps {
  settings: QuizSettings;
  onRestart: () => void;
}

const QuizContainer: React.FC<QuizContainerProps> = ({ settings, onRestart }) => {
  const [questions, setQuestions] = useState<QuizQuestionType[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isComplete, setIsComplete] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    const loadQuestions = async () => {
      setIsLoading(true);
      const questionsData = await fetchQuizQuestions(
        settings.categoryId,
        settings.difficulty,
        settings.amount
      );
      
      if (questionsData.length === 0) {
        // Handle error case - could show error message
        console.error('No questions received');
      }
      
      setQuestions(questionsData);
      setIsLoading(false);
    };

    loadQuestions();
  }, [settings]);

  useEffect(() => {
    if (isLoading || isComplete) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Auto-submit when time runs out
          handleAnswer('');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, isLoading, isComplete]);

  const handleAnswer = (userAnswer: string) => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = decodeHtml(currentQuestion.correct_answer);
    const isCorrect = userAnswer === correctAnswer;

    const newAnswer: QuizAnswer = {
      question: decodeHtml(currentQuestion.question),
      userAnswer: userAnswer || 'No answer',
      correctAnswer,
      isCorrect,
    };

    const updatedAnswers = [...answers, newAnswer];
    setAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(30);
    } else {
      setIsComplete(true);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Preparing your quiz..." />;
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-xl font-bold text-red-700 mb-2">Quiz Unavailable</h2>
          <p className="text-red-600 mb-4">
            Sorry, we couldn't load questions for this quiz. Please try again with different settings.
          </p>
          <button
            onClick={onRestart}
            className="bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isComplete) {
    return <ScoreDisplay answers={answers} onRestart={onRestart} />;
  }

  return (
    <QuizQuestion
      question={questions[currentQuestionIndex]}
      questionNumber={currentQuestionIndex + 1}
      totalQuestions={questions.length}
      onAnswer={handleAnswer}
      timeLeft={timeLeft}
    />
  );
};

export default QuizContainer;