// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCGT57IX0kkmSRNV_je7XgmGTzg6Lb4PWc",
  authDomain: "todo-list-220cc.firebaseapp.com",
  databaseURL: "https://todo-list-220cc-default-rtdb.firebaseio.com",
  projectId: "todo-list-220cc",
  storageBucket: "todo-list-220cc.appspot.com",
  messagingSenderId: "958324484236",
  appId: "1:958324484236:web:5767c04731ab144ed7f3a9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth();
