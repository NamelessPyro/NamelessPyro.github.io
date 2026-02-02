// Firebase Forum Integration
// This module syncs forum data with Firebase Realtime Database

let firebaseReady = false;

// Wait for Firebase to initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if Firebase config exists
    if (typeof firebaseConfig === 'undefined') {
        console.warn('Firebase config not loaded. Forum will use local storage only.');
        return;
    }

    try {
        // Set up Firebase listeners once it's ready
        setTimeout(() => {
            firebaseReady = true;
            setupFirebaseSync();
        }, 500);
    } catch (error) {
        console.warn('Firebase initialization failed:', error);
    }
});

function setupFirebaseSync() {
    if (!firebaseReady || typeof database === 'undefined') {
        console.log('Firebase not available, using local storage');
        return;
    }

    // Load existing posts from Firebase
    const postsRef = database.ref(FORUM_POSTS_REF);
    postsRef.on('value', (snapshot) => {
        const firebaseData = snapshot.val();
        if (firebaseData) {
            // Convert Firebase object to array
            const posts = Object.keys(firebaseData).map(key => ({
                ...firebaseData[key],
                firebaseId: key
            }));
            
            // Sort by date (newest first)
            posts.sort((a, b) => b.createdAt - a.createdAt);
            
            // Update localStorage with Firebase data
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            
            // Reload the forum display
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
        }
    }, (error) => {
        console.warn('Firebase read error:', error);
    });
}

// Override the post saving function to also save to Firebase
const originalHandleCreatePost = window.handleCreatePost;
window.handleCreatePost = function() {
    // Call original handler first
    if (originalHandleCreatePost) {
        originalHandleCreatePost.call(this);
    }
    
    // Then sync to Firebase if available
    if (firebaseReady && typeof database !== 'undefined') {
        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        if (posts.length > 0) {
            const latestPost = posts[0];
            
            const postsRef = database.ref(FORUM_POSTS_REF);
            postsRef.push(latestPost).catch(error => {
                console.warn('Firebase write error:', error);
            });
        }
    }
};

// Function to manually sync posts to Firebase
window.syncPostsToFirebase = function() {
    if (!firebaseReady || typeof database === 'undefined') {
        alert('Firebase is not available');
        return;
    }

    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const postsRef = database.ref(FORUM_POSTS_REF);
    
    // Clear and rebuild
    postsRef.remove().then(() => {
        posts.forEach(post => {
            const { firebaseId, ...postData } = post;
            postsRef.push(postData);
        });
        alert('Posts synced to Firebase!');
    }).catch(error => {
        console.error('Sync error:', error);
        alert('Error syncing to Firebase: ' + error.message);
    });
};

// Function to load posts from Firebase only
window.loadFromFirebaseOnly = function() {
    if (!firebaseReady || typeof database === 'undefined') {
        alert('Firebase is not available');
        return;
    }

    const postsRef = database.ref(FORUM_POSTS_REF);
    postsRef.once('value', (snapshot) => {
        const firebaseData = snapshot.val();
        if (firebaseData) {
            const posts = Object.keys(firebaseData).map(key => ({
                ...firebaseData[key],
                firebaseId: key
            }));
            posts.sort((a, b) => b.createdAt - a.createdAt);
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
            alert('Loaded posts from Firebase!');
        }
    }).catch(error => {
        console.error('Firebase read error:', error);
        alert('Error loading from Firebase: ' + error.message);
    });
};
