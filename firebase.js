// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD58H__o-sGRkFC-Y1_vFrLQllV9E5irok",
  authDomain: "naijamapalat.firebaseapp.com",
  projectId: "naijamapalat",
  storageBucket: "naijamapalat.firebasestorage.app",
  messagingSenderId: "571976340876",
  appId: "1:571976340876:web:d8299faa7d257462d0b2a9",
  measurementId: "G-SLF8DJ8TFM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);