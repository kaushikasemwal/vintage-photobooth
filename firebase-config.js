// Firebase Configuration for Vintage PhotoBooth Real-time Collaboration
// Using Firebase v8 SDK for compatibility with our PhotoBooth app

const firebaseConfig = {
  apiKey: "AIzaSyAe6ULTc8lJLvlYgz4VmUaqHwn-2N91r8o",
  authDomain: "vintage-photobooth.firebaseapp.com",
  databaseURL: "https://vintage-photobooth-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "vintage-photobooth",
  storageBucket: "vintage-photobooth.firebasestorage.app",
  messagingSenderId: "675613805301",
  appId: "1:675613805301:web:d64ea8e234adbc914bd3bc",
  measurementId: "G-CLG72N120G"
};

// Initialize Firebase (v8 style for PhotoBooth compatibility)
firebase.initializeApp(firebaseConfig);

// Get database reference for real-time collaboration
const database = firebase.database();

console.log('🔥 Firebase initialized for Vintage PhotoBooth collaboration');