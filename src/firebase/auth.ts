import firebase_app from './config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  getAuth,
  signOut,
} from 'firebase/auth';
import { FirebaseError } from 'firebase/app';

import { setUserData } from './db';

const auth = getAuth(firebase_app);

export async function signUp(email: string, password: string) {
  let result = null,
    error = null;
  try {
    const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
    const userDoc = await setUserData(userCredentials.user.uid, email.split('@')[0]);
  } catch (e) {
    if (e instanceof FirebaseError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function signIn(email: string, password: string) {
  let result = null,
    error = null;
  try {
    result = await signInWithEmailAndPassword(auth, email, password);
  } catch (e) {
    if (e instanceof FirebaseError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}

export async function logOut() {
  let result = null,
    error = null;
  try {
    result = await signOut(auth);
  } catch (e) {
    if (e instanceof FirebaseError) error = e.message;
    else error = 'Error occured';
  }
  return { result, error };
}
