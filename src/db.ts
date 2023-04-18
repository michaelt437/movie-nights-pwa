import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import "firebase/compat/database";
import { getFirestore } from "firebase/firestore";

const fbConfig = {
  apiKey: process.env.VUE_APP_FBKEY,
  authDomain: "movie-nights-pwa.firebaseapp.com",
  databaseURL: "https://movie-nights-pwa.firebaseio.com",
  projectId: "movie-nights-pwa",
  storageBucket: "movie-nights-pwa.appspot.com",
  messagingSenderId: "508423998336",
  appId: "1:508423998336:web:50fe0244a33d43d34c8f65"
};

const app = initializeApp(fbConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
