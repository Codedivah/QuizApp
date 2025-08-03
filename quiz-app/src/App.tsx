import React, { useState } from 'react';
import { QuizSettings } from './types/quiz';
import TopicSelector from './components/TopicSelector';
import QuizContainer from './components/QuizContainer';

type AppState = 'topic-selection' | 'quiz-active';

function App() {
  const [appState, setAppState] = useState<AppState>('topic-selection');
  const [quizSettings, setQuizSettings] = useState<QuizSettings | null>(null);

  const handleStartQuiz = (settings: QuizSettings) => {
    setQuizSettings(settings);
    setAppState('quiz-active');
  };

  const handleRestart = () => {
    setQuizSettings(null);
    setAppState('topic-selection');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-8 px-4">
      {appState === 'topic-selection' && (
        <TopicSelector onStartQuiz={handleStartQuiz} />
      )}
      
      {appState === 'quiz-active' && quizSettings && (
        <QuizContainer settings={quizSettings} onRestart={handleRestart} />
      )}
    </div>
  );
}

export default App;