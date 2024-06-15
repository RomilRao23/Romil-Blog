// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "romil-blog.firebaseapp.com",
  projectId: "romil-blog",
  storageBucket: "romil-blog.appspot.com",
  messagingSenderId: "208065576451",
  appId: "1:208065576451:web:eb9ff8270a978c6f635836"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);