// Firebase Configuration
// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyA29R-RsQSDpG2AxfDOK5protp5522txfg",
    authDomain: "npforum-25919.firebaseapp.com",
    databaseURL: "https://npforum-25919-default-rtdb.firebaseio.com",
    projectId: "npforum-25919",
    storageBucket: "npforum-25919.appspot.com",
    messagingSenderId: "19847033275",
    appId: "1:19847033275:web:5c3b4b56b0e238cf9e149e",
    measurementId: "G-9TMSF9RJBG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get reference to the Realtime Database
const database = firebase.database();

// Database references
const FORUM_POSTS_REF = 'forumPosts';
const FORUM_PROFILES_REF = 'profiles';
