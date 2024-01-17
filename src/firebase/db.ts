'use server';

import firebase_app from './config';
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  increment,
  arrayUnion,
} from 'firebase/firestore';
import { FirestoreError } from 'firebase/firestore';
import { uuidv4 } from '@firebase/util';
import { checkAnswer, getUniqueQuestion } from '@/helpers/questions';
import { revalidatePath } from 'next/cache';

const db = getFirestore(firebase_app);

const userRef = collection(db, 'users');

export type User = {
  userName: string;
  easyModeRecord: number;
  mediumModeRecord: number;
  hardModeRecord: number;
};

export type Record = {
  difficulty: 'easy' | 'medium' | 'hard';
  userName: string;
  record: number;
};

export async function setUserData(uid: string, userName: string) {
  let result = null,
    error = null;
  try {
    const { result: isUnique, error: isUniqueError } = await isUserNameUnique(userName);
    if (isUnique) {
      result = await setDoc(doc(userRef, uid), {
        userName,
        easyModeRecord: 0,
        mediumModeRecord: 0,
        hardModeRecord: 0,
      });
    } else {
      error = 'Username already in use';
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function getUserData(uid: string) {
  let result: User | null = null,
    error = null;
  try {
    const responce = await getDoc(doc(userRef, uid));
    if (responce.exists()) {
      result = {
        userName: await responce.get('userName'),
        easyModeRecord: await responce.get('easyModeRecord'),
        mediumModeRecord: await responce.get('mediumModeRecord'),
        hardModeRecord: await responce.get('hardModeRecord'),
      };
    } else error = 'User with this id is not found';
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

async function getAllUsernames() {
  let result: string[] = [],
    error = null;
  try {
    const userSnapshots = await getDocs(userRef);
    userSnapshots.forEach((doc) => {
      const user = doc.data();
      result.push(user.userName);
    });
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

async function isUserNameUnique(userName: string) {
  let result = null,
    error = null;
  try {
    const { result: userNames, error } = await getAllUsernames();
    if (!error && userNames) result = !userNames.includes(userName);
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function changeUserName(uid: string, userName: string) {
  let result = null,
    error = null;
  try {
    const { result: isUnique, error: isUniqueError } = await isUserNameUnique(userName);
    if (isUnique) {
      result = await updateDoc(doc(userRef, uid), {
        userName,
      });
    } else {
      error = 'Username was already used';
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  revalidatePath('/profile');
  return { result, error };
}

async function compareUserRecord(
  uid: string,
  difficulty: 'easy' | 'medium' | 'hard',
  record: number,
) {
  try {
    const { result: userData, error }: { result: User | null; error: string | null } =
      await getUserData(uid);
    if (!error && userData) {
      if (record > userData[`${difficulty}ModeRecord`])
        await updateUserRecord(uid, difficulty, record);
    }
  } catch (error) {
    console.log(error);
  }
}

async function updateUserRecord(
  uid: string,
  difficulty: 'easy' | 'medium' | 'hard',
  record: number,
) {
  let result = null,
    error = null;
  try {
    result = await updateDoc(doc(userRef, uid), {
      [`${difficulty}ModeRecord`]: record,
    });
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  revalidatePath('/leaderboards');
  return { result, error };
}

async function getAllRecords(difficulty: 'easy' | 'medium' | 'hard') {
  let result: Record[] = [],
    error = null;
  try {
    const userSnapshots = await getDocs(userRef);
    userSnapshots.forEach((doc) => {
      const user = doc.data();
      result.push({ difficulty, userName: user.userName, record: user[`${difficulty}ModeRecord`] });
    });
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function getBestRecords(difficulty: 'easy' | 'medium' | 'hard') {
  let result: Record[] = [],
    error = null;
  try {
    const { result: allRecords, error: allRecordsError } = await getAllRecords(difficulty);
    if (allRecords && !allRecordsError) {
      result = allRecords
        .sort((a, b) => b.record - a.record)
        .filter((record) => record.record > 0)
        .slice(0, 3);
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

const gamesRef = collection(db, 'games');

export type savedQuestion = {
  questionId: string;
  correctAnswer: string;
  question: string;
  userAnswer: string;
};

export type Question = {
  category: string;
  difficulty: string;
  id: string;
  question: string;
  options: string[];
};

export type Game = {
  currentQuestion: Question;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  isGameOver: boolean;
  mistakes: 3;
  score: 4;
  questions: savedQuestion[];
  user: string;
};

export async function createGame(
  uid: string,
  category: string = 'all',
  difficulty: string = 'easy',
) {
  let result = null,
    error = null;
  const id: string = uuidv4();
  try {
    const data = await setDoc(doc(gamesRef, id), {
      user: uid,
      category,
      difficulty,
      score: 0,
      mistakes: 0,
      questions: [],
      currentQuestion: null,
      isGameOver: false,
    });
    await createNewQuestion(id);
    result = { id };
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function getGameData(gameId: string) {
  let result: Game | null = null,
    error = null;
  try {
    const responce = await getDoc(doc(gamesRef, gameId));
    if (responce.exists()) {
      result = {
        score: await responce.get('score'),
        mistakes: await responce.get('mistakes'),
        category: await responce.get('category'),
        difficulty: await responce.get('difficulty'),
        isGameOver: await responce.get('isGameOver'),
        questions: await responce.get('questions'),
        currentQuestion: await responce.get('currentQuestion'),
        user: await responce.get('user'),
      };
    } else error = 'Game with this id is not found';
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

async function getAskedQuestions(gameId: string) {
  let result: string[] = [],
    error = null;
  try {
    const { result: gameData, error } = await getGameData(gameId);
    gameData?.questions.forEach((question) => result.push(question.questionId));
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

//TODO: check if game is finished
export async function createNewQuestion(gameId: string) {
  let result = null,
    error = null;
  try {
    const { result: gameData, error: gameDataError } = await getGameData(gameId);
    const { result: askedQuestions, error: askedQuestionsError } = await getAskedQuestions(gameId);
    if (askedQuestions && !askedQuestionsError && gameData && !gameDataError) {
      const {
        result: questionData,
        error: questionDataError,
      }: { result: Question | null; error: any } = await getUniqueQuestion(
        gameData.category,
        gameData.difficulty,
        askedQuestions,
      );
      if (questionData && !questionDataError) {
        await updateDoc(doc(gamesRef, gameId), {
          currentQuestion: questionData,
        });
        result = questionData;
      }
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  revalidatePath(`/game/${gameId}`);
  return { result, error };
}

export async function answerQuestion(gameId: string, answer: string) {
  let result = null,
    error = null;
  try {
    const { result: gameData, error: gameDataError } = await getGameData(gameId);
    if (gameData && !gameDataError) {
      const { result: answerResult, error: answerError } = await checkAnswer(
        gameData.currentQuestion.id,
        answer,
      );
      if (!answerError && answerResult) {
        const questionObj: savedQuestion = {
          questionId: gameData.currentQuestion.id,
          userAnswer: answer,
          correctAnswer: answerResult?.correctAnswer,
          question: answerResult.question,
        };
        if (answerResult.isRight) await updateGameAfterRightAnswer(gameId, questionObj);
        else await updateGameAfterWrongAnswer(gameId, questionObj);
        await createNewQuestion(gameId);
      }
      result = answerResult;
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  revalidatePath(`/game/${gameId}`);
  return { result, error };
}

async function updateGameAfterRightAnswer(gameId: string, questionObj: savedQuestion) {
  try {
    await updateDoc(doc(gamesRef, gameId), {
      score: increment(1),
      currentQuestion: null,
      questions: arrayUnion(questionObj),
    });
  } catch (error) {
    console.log(error);
  }
}

async function updateGameAfterWrongAnswer(gameId: string, questionObj: savedQuestion) {
  try {
    await updateDoc(doc(gamesRef, gameId), {
      mistakes: increment(1),
      currentQuestion: null,
      questions: arrayUnion(questionObj),
    });
    await checkAmountOfMistakes(gameId);
  } catch (error) {
    console.log(error);
  }
}

async function checkAmountOfMistakes(gameId: string) {
  try {
    const { result: gameData, error } = await getGameData(gameId);
    if (!error && gameData) {
      if (gameData.mistakes >= 3) {
        await updateDoc(doc(gamesRef, gameId), {
          isGameOver: true,
        });
        await compareUserRecord(gameData.user, gameData.difficulty, gameData.score);
      }
    }
  } catch (e) {
    console.log(e);
  }
}

export async function getUserGames(uid: string) {
  let result: any = [],
    error = null;
  try {
    const gamesSnapshots = await getDocs(gamesRef);
    gamesSnapshots.forEach((doc) => {
      const game = doc.data();
      if (game.user === uid) result.push({ ...game, id: doc.id });
    });
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function getUnfinishedUserGames(uid: string) {
  let result: any = [],
    error = null;
  try {
    const { result: games, error: getGamesError } = await getUserGames(uid);
    if (games && !getGamesError) {
      result = games.filter((game: { isGameOver: boolean }) => !game.isGameOver);
    }
  } catch (e) {
    if (e instanceof FirestoreError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}
