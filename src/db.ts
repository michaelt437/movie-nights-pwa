import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/firestore";

// Get Firestore instance
const db = firebase
  .initializeApp({
    apiKey: process.env.VUE_APP_FBKEY,
    authDomain: "movie-nights-pwa.firebaseapp.com",
    databaseURL: "https://movie-nights-pwa.firebaseio.com",
    projectId: "movie-nights-pwa",
    storageBucket: "movie-nights-pwa.appspot.com",
    messagingSenderId: "508423998336",
    appId: "1:508423998336:web:50fe0244a33d43d34c8f65"
  })
  .firestore();

const auth = firebase.auth;
const fb = firebase;

export { db, auth, fb };
