import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, ArrowRight } from 'lucide-react';
import { QuizQuestion as QuizQuestionType } from '../types/quiz';
import { getShuffledAnswers, decodeHtml } from '../utils/quizHelpers';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
  timeLeft?: number;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  timeLeft = 30,
}) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [shuffledAnswers] = useState(() => getShuffledAnswers(question));

  const handleAnswerSelect = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    setShowFeedback(true);
    
    setTimeout(() => {
      onAnswer(answer);
    }, 1500);
  };

  const getAnswerButtonClass = (answer: string) => {
    if (!showFeedback) {
      return selectedAnswer === answer
        ? 'bg-blue-100 border-blue-500 text-blue-700'
        : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50';
    }

    const isCorrect = answer === decodeHtml(question.correct_answer);
    const isSelected = answer === selectedAnswer;

    if (isCorrect) {
      return 'bg-green-100 border-green-500 text-green-700';
    }
    
    if (isSelected && !isCorrect) {
      return 'bg-red-100 border-red-500 text-red-700';
    }

    return 'bg-gray-50 border-gray-200 text-gray-500';
  };

  const getAnswerIcon = (answer: string) => {
    if (!showFeedback) return null;
    
    const isCorrect = answer === decodeHtml(question.correct_answer);
    const isSelected = answer === selectedAnswer;

    if (isCorrect) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
    
    if (isSelected && !isCorrect) {
      return <XCircle className="w-5 h-5 text-red-600" />;
    }

    return null;
  };

  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {questionNumber} of {totalQuestions}
          </span>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
              {question.category}
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${
              question.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
              question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {question.difficulty}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 leading-relaxed">
            {decodeHtml(question.question)}
          </h2>
        </div>

        {/* Answer Options */}
        <div className="space-y-3">
          {shuffledAnswers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(answer)}
              disabled={showFeedback}
              className={`
                w-full p-4 border-2 rounded-lg text-left font-medium transition-all duration-200
                flex items-center justify-between group
                ${getAnswerButtonClass(answer)}
                ${!showFeedback ? 'hover:shadow-md transform hover:-translate-y-1' : ''}
                ${showFeedback ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <span>{answer}</span>
              <div className="flex items-center space-x-2">
                {getAnswerIcon(answer)}
                {!showFeedback && (
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-blue-700 font-medium">
            {selectedAnswer === decodeHtml(question.correct_answer)
              ? 'Correct! Well done! 🎉'
              : `Incorrect. The correct answer was: ${decodeHtml(question.correct_answer)}`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default QuizQuestion;