// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi780iVxgHRE4kYwDkaIKV3WObFjQ9ajI",
  authDomain: "project-2-6b47e.firebaseapp.com",
  projectId: "project-2-6b47e",
  storageBucket: "project-2-6b47e.firebasestorage.app",
  messagingSenderId: "747433932920",
  appId: "1:747433932920:web:4c62794e998d47da05158d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
