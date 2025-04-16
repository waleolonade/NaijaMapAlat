// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyCNpDP8YsfM4BXp7lrzBWAbj-zorvfhQPo",
//   authDomain: "naijamapalert-b024c.firebaseapp.com",
//   projectId: "naijamapalert-b024c",
//   storageBucket: "naijamapalert-b024c.firebasestorage.app",
//   messagingSenderId: "1088631221182",
//   appId: "1:1088631221182:web:6cf66372a780242456e7ef",
//   measurementId: "G-67D4G7Z38R"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// export { auth };


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Add this import

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNpDP8YsfM4BXp7lrzBWAbj-zorvfhQPo",
  authDomain: "naijamapalert-b024c.firebaseapp.com",
  projectId: "naijamapalert-b024c",
  storageBucket: "naijamapalert-b024c.firebasestorage.app",
  messagingSenderId: "1088631221182",
  appId: "1:1088631221182:web:6cf66372a780242456e7ef",
  measurementId: "G-67D4G7Z38R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
