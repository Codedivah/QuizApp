import React, { useState, useEffect } from 'react';
import { Play, BookOpen, Zap, GraduationCap } from 'lucide-react';
import { QuizCategory, QuizSettings, Difficulty } from '../types/quiz';
import { fetchCategories } from '../services/quizApi';
import LoadingSpinner from './LoadingSpinner';

interface TopicSelectorProps {
  onStartQuiz: (settings: QuizSettings) => void;
}

const TopicSelector: React.FC<TopicSelectorProps> = ({ onStartQuiz }) => {
  const [categories, setCategories] = useState<QuizCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number>(9); // General Knowledge
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [amount, setAmount] = useState<number>(10);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      const categoriesData = await fetchCategories();
      setCategories(categoriesData);
      setIsLoading(false);
    };

    loadCategories();
  }, []);

  const handleStartQuiz = () => {
    onStartQuiz({
      categoryId: selectedCategory,
      difficulty,
      amount,
    });
  };

  const getDifficultyIcon = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return <BookOpen className="w-4 h-4" />;
      case 'medium': return <Zap className="w-4 h-4" />;
      case 'hard': return <GraduationCap className="w-4 h-4" />;
    }
  };

  const getDifficultyColor = (diff: Difficulty) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading quiz categories..." />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">QuizMaster</h1>
        <p className="text-xl text-gray-600">Test your knowledge across various topics</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Choose a Topic
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
              <button
                key={diff}
                onClick={() => setDifficulty(diff)}
                className={`
                  p-3 border-2 rounded-lg flex items-center justify-center space-x-2 font-medium transition-all
                  ${difficulty === diff 
                    ? getDifficultyColor(diff) + ' ring-2 ring-offset-2 ring-blue-400'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                  }
                `}
              >
                {getDifficultyIcon(diff)}
                <span className="capitalize">{diff}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Number of Questions
          </label>
          <select
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          >
            <option value={5}>5 Questions</option>
            <option value={10}>10 Questions</option>
            <option value={15}>15 Questions</option>
            <option value={20}>20 Questions</option>
          </select>
        </div>

        <button
          onClick={handleStartQuiz}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-6 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-3 shadow-lg"
        >
          <Play className="w-5 h-5" />
          <span>Start Quiz</span>
        </button>
      </div>
    </div>
  );
};

export default TopicSelector;