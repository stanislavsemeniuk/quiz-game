'use server';

import type { Question } from '@/firebase/db';

type QuestionData = {
  category: string;
  id: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  question: { text: string };
  tags: string[];
  type: string;
  difficulty: string;
  isNiche: boolean;
  regions?: string[];
};

function shuffle(array: string[]) {
  return array.sort(() => Math.random() - 0.5);
}

async function getQuestions(category: string, difficulty: string, limit: number) {
  let result: QuestionData[] | null = null,
    error = null;
  try {
    const response = await fetch(
      `https://the-trivia-api.com/v2/questions?limit=${limit}&${
        category === 'all' ? '' : `categories=${category}`
      }&difficulties=${difficulty}`,
      { cache: 'no-store' },
    );
    result = await response.json();
  } catch (e) {
    if (typeof e === 'string') {
      error = e;
    } else if (e instanceof Error) {
      error = e.message;
    }
  }
  return { result, error };
}

export async function getUniqueQuestion(
  category: string,
  difficulty: string,
  askedQuestions: string[],
): Promise<{
  result: Question | null;
  error: string | null;
}> {
  let result: Question | null = null,
    error = null;
  try {
    const { result: questions, error: questionsError } = await getQuestions(
      category,
      difficulty,
      20,
    );
    if (questions && !error) {
      for (let i = 0; i < questions?.length; i++) {
        if (!askedQuestions.includes(questions[i].id)) {
          const options = shuffle([...questions[i].incorrectAnswers, questions[i].correctAnswer]);
          result = {
            id: questions[i].id,
            question: questions[i].question.text,
            category: questions[i].category,
            options,
            difficulty: questions[i].difficulty,
          };
          break;
        }
      }
    }
  } catch (e) {
    if (typeof e === 'string') {
      error = e;
    } else if (e instanceof Error) {
      error = e.message;
    }
  }
  if (!result) return await getUniqueQuestion(category, difficulty, askedQuestions);
  return { result, error };
}

export async function checkAnswer(id: string, userAnswer: string) {
  let result = null,
    error = null;
  try {
    const responce = await fetch(`https://the-trivia-api.com/v2/question/${id}`);
    const data: QuestionData = await responce.json();
    result = {
      isRight: data.correctAnswer === userAnswer,
      correctAnswer: data.correctAnswer,
      question: data.question.text,
    };
  } catch (e) {
    if (typeof e === 'string') {
      error = e;
    } else if (e instanceof Error) {
      error = e.message;
    }
  }
  return { result, error };
}

export async function getCategoriesForAGame() {
  return [
    'all',
    'music',
    'sport_and_leisure',
    'film_and_tv',
    'arts_and_literature',
    'history',
    'society_and_culture',
    'science',
    'geography',
    'food_and_drink',
    'general_knowledge',
  ];
}

export async function getDifficultiesForAGame() {
  return ['easy', 'medium', 'hard'];
}
