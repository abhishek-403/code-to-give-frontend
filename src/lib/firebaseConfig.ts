import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseCredentials } from "./constants";

const app = initializeApp(firebaseCredentials);
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export {
  auth,
  googleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
};
