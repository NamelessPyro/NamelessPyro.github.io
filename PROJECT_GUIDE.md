# NamelessPyro Forum - Complete Setup Guide

## Project Overview

A real-time forum application with:
- **User Profiles** - Create accounts with password authentication
- **Forum Posts** - Create and share discussion threads
- **Comments/Replies** - Respond to posts in real-time
- **Shared Data** - All posts and comments sync across users via Firebase
- **Terminal Aesthetic** - Retro hacker terminal design

## Architecture

### Pages
- **index.html** - Home page with profile navigation
- **profiles.html** - User profile management system
- **files.html** - Main forum discussion board

### JavaScript Modules
- **firebase-config.js** - Firebase credentials and initialization
- **profiles.js** - User authentication and profile management
- **forum.js** - Forum post creation and comments
- **firebase-forum.js** - Real-time sync with Firebase
- **init.js** - Module initialization and coordination
- **script.js** - Home page scripts
- **styles.css** - Global styling

## Firebase Setup (Already Configured)

Your Firebase project is ready with:
- **Project ID**: npforum-25919
- **Database URL**: https://npforum-25919-default-rtdb.firebaseio.com
- **Mode**: Test mode (allows read/write without authentication)

## How It Works

### User Registration/Login
1. Navigate to Profiles page
2. Enter username and password
3. Click "PROFILE /create" to register
4. Enter existing username/password to login
5. Profile info appears in "Registered Profiles" list

### Creating Posts
1. Login to a profile (required)
2. Go to Forum page
3. Enter thread title and message
4. Click "submit" to post
5. Post appears instantly for all users

### Replying to Posts
1. Click "comments" on any post to expand replies
2. Type your response in the comment box
3. Click "save" to submit
4. Reply appears instantly for all users

### Data Sync
- **Local Storage**: Posts/profiles cached locally for speed
- **Firebase**: Real-time sync across all browsers/tabs
- **Automatic**: Changes sync instantly without page refresh

## Troubleshooting

### Posts not syncing
1. Open browser console (F12)
2. Check for error messages
3. Verify Firebase config is loaded: `window.firebaseConfig`
4. Check Firebase Database is in "Test mode"

### Profiles not working
1. Verify localStorage has space (clear old data if needed)
2. Try logging in with correct password
3. Check browser allows localStorage

### Comments not appearing
1. Ensure you're logged in
2. Refresh page to sync from Firebase
3. Check browser console for errors

## Performance Tips

- Forum loads last 50 posts by default
- Comments collapse/expand to save space
- Firebase caches frequently accessed data
- Use profile color for quick visual identification

## Future Enhancements

- Private messaging between users
- Post voting/ranking system
- User reputation/karma
- Thread categories/tags
- Search functionality
- User profiles with post history

## File Structure

```
Website/
├── index.html              # Home page
├── profiles.html           # Profile management
├── files.html              # Forum main page
├── styles.css              # All styling
├── firebase-config.js      # Firebase setup
├── profiles.js             # Profile logic
├── forum.js                # Forum logic
├── firebase-forum.js       # Firebase sync
├── init.js                 # Module initialization
└── FIREBASE_SETUP.md       # Firebase guide
```

## Support

If something breaks:
1. Check browser console for errors
2. Verify all scripts loaded: `window.ModuleStatus`
3. Clear localStorage: `localStorage.clear()`
4. Hard refresh page: Ctrl+Shift+R

## Version
- v1.0 - Complete with profiles, forum, Firebase sync
