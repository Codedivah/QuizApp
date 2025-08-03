import { QuizCategory, QuizQuestion } from '../types/quiz';

const BASE_URL = 'https://opentdb.com';

export const fetchCategories = async (): Promise<QuizCategory[]> => {
  try {
    const response = await fetch(`${BASE_URL}/api_category.php`);
    const data = await response.json();
    return data.trivia_categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchQuizQuestions = async (
  categoryId: number,
  difficulty: string,
  amount: number = 10
): Promise<QuizQuestion[]> => {
  try {
    const params = new URLSearchParams({
      amount: amount.toString(),
      category: categoryId.toString(),
      difficulty: difficulty,
      type: 'multiple',
    });

    const response = await fetch(`${BASE_URL}/api.php?${params}`);
    const data = await response.json();
    
    if (data.response_code === 0) {
      return data.results || [];
    }
    
    throw new Error('Failed to fetch questions');
  } catch (error) {
    console.error('Error fetching quiz questions:', error);
    return [];
  }
};