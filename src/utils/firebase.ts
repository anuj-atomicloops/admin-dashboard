// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBzWhgRqNo_ufxk6zvFvwgcZ8OS5f_o0b8",
  authDomain: "al-admin-dashboard.firebaseapp.com",
  projectId: "al-admin-dashboard",
  storageBucket: "al-admin-dashboard.appspot.com",
  messagingSenderId: "342351922621",
  appId: "1:342351922621:web:67dffd88f92db5deb37ed4",
  measurementId: "G-7P0TV6PWTW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const storage = getStorage(app);
export const auth = getAuth(app);
