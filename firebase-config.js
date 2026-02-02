// Firebase Configuration
// Initialize Firebase with your config
const firebaseConfig = {
    apiKey: "AIzaSyDemoKey123456789", // Replace with your API key
    authDomain: "your-project.firebaseapp.com", // Replace with your domain
    databaseURL: "https://your-project-default-rtdb.firebaseio.com", // Replace with your database URL
    projectId: "your-project-id", // Replace with your project ID
    storageBucket: "your-project.appspot.com", // Replace with your storage bucket
    messagingSenderId: "123456789", // Replace with your sender ID
    appId: "1:123456789:web:abcdef123456" // Replace with your app ID
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get reference to the Realtime Database
const database = firebase.database();

// Database references
const FORUM_POSTS_REF = 'forumPosts';
const FORUM_PROFILES_REF = 'profiles';
