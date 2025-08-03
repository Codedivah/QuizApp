import React from 'react';
import { Trophy, Target, RotateCcw, Award, TrendingUp } from 'lucide-react';
import { QuizAnswer } from '../types/quiz';
import { calculateScorePercentage, getScoreColor, getPerformanceMessage } from '../utils/quizHelpers';

interface ScoreDisplayProps {
  answers: QuizAnswer[];
  onRestart: () => void;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ answers, onRestart }) => {
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const totalQuestions = answers.length;
  const percentage = calculateScorePercentage(correctAnswers, totalQuestions);
  const performanceMessage = getPerformanceMessage(percentage);

  return (
    <div className="max-w-4xl mx-auto">
      {/* Main Score Card */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <Trophy className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-xl text-gray-600">{performanceMessage}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-600">
              {correctAnswers}/{totalQuestions}
            </div>
            <div className="text-sm text-blue-700">Correct Answers</div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(percentage)}`}>
              {percentage}%
            </div>
            <div className="text-sm text-purple-700">Accuracy</div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-center mb-2">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-600">
              {percentage >= 70 ? 'Pass' : 'Retry'}
            </div>
            <div className="text-sm text-green-700">Result</div>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto shadow-lg"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Take Another Quiz</span>
        </button>
      </div>

      {/* Detailed Results */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Detailed Results</h3>
        <div className="space-y-4">
          {answers.map((answer, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${
                answer.isCorrect
                  ? 'bg-green-50 border-green-200'
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {answer.isCorrect ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 mb-2">
                    {answer.question}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Your answer: </span>
                      <span className={answer.isCorrect ? 'text-green-700 font-medium' : 'text-red-700 font-medium'}>
                        {answer.userAnswer}
                      </span>
                    </div>
                    {!answer.isCorrect && (
                      <div>
                        <span className="text-gray-600">Correct answer: </span>
                        <span className="text-green-700 font-medium">
                          {answer.correctAnswer}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreDisplay;