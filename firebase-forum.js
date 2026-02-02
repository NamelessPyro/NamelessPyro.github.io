// Firebase Forum Integration
// This module syncs forum data with Firebase Realtime Database

let firebaseReady = false;
let firebaseSyncInitialized = false;

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

// Also support deferred initialization
window.onModulesReady = function() {
    if (!firebaseSyncInitialized && firebaseReady && typeof database !== 'undefined') {
        console.log('Modules ready, syncing Firebase...');
        setupFirebaseSync();
    }
};

function setupFirebaseSync() {
    if (firebaseSyncInitialized) {
        console.log('Firebase sync already initialized');
        return;
    }

    if (!firebaseReady || typeof database === 'undefined') {
        console.log('Firebase not available, using local storage');
        return;
    }

    firebaseSyncInitialized = true;
    console.log('Firebase ready, loading posts...');

    // Load existing posts from Firebase
    const postsRef = database.ref(FORUM_POSTS_REF);
    postsRef.once('value', (snapshot) => {
        const firebaseData = snapshot.val();
        console.log('Firebase data:', firebaseData);
        
        if (firebaseData) {
            // Convert Firebase object to array
            const posts = Object.keys(firebaseData).map(key => ({
                ...firebaseData[key],
                firebaseId: key
            }));
            
            // Sort by date (newest first)
            posts.sort((a, b) => b.createdAt - a.createdAt);
            
            console.log('Loaded posts from Firebase:', posts.length);
            
            // Update localStorage with Firebase data
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            
            // Reload the forum display
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
        } else {
            console.log('No posts in Firebase yet');
        }
    }, (error) => {
        console.warn('Firebase read error:', error);
    });

    // Also listen for real-time updates
    postsRef.on('child_added', (snapshot) => {
        console.log('New post from Firebase:', snapshot.val());
        const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        
        // Check if post already exists
        const postId = snapshot.key;
        const exists = posts.some(p => p.firebaseId === postId);
        
        if (!exists) {
            posts.push({
                ...snapshot.val(),
                firebaseId: postId
            });
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            
            if (typeof loadPosts === 'function') {
                loadPosts();
            }
        }
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
        setTimeout(() => {
            const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
            if (posts.length > 0) {
                const latestPost = posts[0];
                
                // Only push if it's a new post (not already in Firebase)
                if (!latestPost.firebaseId) {
                    const postsRef = database.ref(FORUM_POSTS_REF);
                    postsRef.push(latestPost).then((snapshot) => {
                        console.log('Post synced to Firebase:', snapshot.key);
                    }).catch(error => {
                        console.warn('Firebase write error:', error);
                        alert('Warning: Could not sync post to Firebase. ' + error.message);
                    });
                }
            }
        }, 100);
    }
};

// Function to sync replies to Firebase
window.syncReplyToFirebase = function(postId, reply, post) {
    if (!firebaseReady || typeof database === 'undefined') {
        console.warn('Firebase not available for syncing reply');
        return;
    }

    if (!post.firebaseId) {
        console.warn('Cannot sync reply - post not yet in Firebase');
        return;
    }

    const postRef = database.ref(FORUM_POSTS_REF + '/' + post.firebaseId);
    postRef.update({
        replies: post.replies
    }).catch(error => {
        console.warn('Error syncing reply to Firebase:', error);
    });
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
