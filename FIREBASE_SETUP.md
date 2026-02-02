# Firebase Setup Guide

## Quick Setup (5 minutes)

1. **Go to Firebase Console**
   - Visit: https://console.firebase.google.com/
   - Click "Create project" or select existing project
   - Name it something like "NamelessPyro-Forum"

2. **Enable Realtime Database**
   - In left sidebar, click "Realtime Database"
   - Click "Create Database"
   - Choose your region (default is fine)
   - **IMPORTANT**: Start in "Test mode" for now (allows reads/writes)

3. **Get Your Config**
   - Go to Project Settings (gear icon, top left)
   - Click "Your apps" section
   - Click the Web icon (`</>`), or create a new app
   - Copy the Firebase config object
   - Paste it into `firebase-config.js`

4. **Add Firebase to HTML**
   - The `index.html` file now includes Firebase CDN links
   - Make sure both are loaded before your custom scripts

5. **Test It**
   - Open your forum page
   - Create a post - it should sync to Firebase
   - Open in another tab/browser - you'll see the same posts!

## Your Config Should Look Like:
```javascript
const firebaseConfig = {
    apiKey: "AIzaSyDl2y8Xk...",
    authDomain: "namelesspyro-forum.firebaseapp.com",
    databaseURL: "https://namelesspyro-forum-default-rtdb.firebaseio.com",
    projectId: "namelesspyro-forum",
    storageBucket: "namelesspyro-forum.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcd..."
};
```

## Security Rules (Optional but Recommended)

Later, you can lock down your database with rules like:
```json
{
  "rules": {
    "forumPosts": {
      ".read": true,
      ".write": true
    },
    "profiles": {
      ".read": true,
      ".write": "auth != null"
    }
  }
}
```

## Troubleshooting

- **"Firebase is not defined"**: Make sure firebase CDN is loaded before config file
- **Posts not syncing**: Check console for errors, verify Firebase URL in config
- **Database looks empty**: Check you're using "Test mode" on your database

That's it! Your forum will now be shared across all users.
