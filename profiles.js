// Profile Management System
const PROFILES_STORAGE_KEY = 'forumProfiles';
const CURRENT_USER_KEY = 'currentUser';

// DOM Elements
const usernameInput = document.getElementById('username');
const userBioInput = document.getElementById('userBio');
const userColorInputs = document.querySelectorAll('input[name="userColor"]');
const createProfileBtn = document.getElementById('createProfileBtn');
const currentUserDisplay = document.getElementById('currentUser');
const userActionsDiv = document.getElementById('userActions');
const logoutBtn = document.getElementById('logoutBtn');
const profilesList = document.getElementById('profilesList');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    syncProfileData();
    loadProfiles();
    displayCurrentUser();
    setupEventListeners();
});

// Listen for storage changes (other tabs/windows)
window.addEventListener('storage', (e) => {
    if (e.key === PROFILES_STORAGE_KEY || e.key === CURRENT_USER_KEY) {
        loadProfiles();
        displayCurrentUser();
    }
});

function setupEventListeners() {
    createProfileBtn.addEventListener('click', handleCreateProfile);
    logoutBtn.addEventListener('click', handleLogout);
    
    // Allow Enter to create profile
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleCreateProfile();
    });
}

function handleCreateProfile() {
    const username = usernameInput.value.trim();
    const bio = userBioInput.value.trim();
    const color = document.querySelector('input[name="userColor"]:checked').value;

    if (!username) {
        alert('Please enter a username.');
        return;
    }

    if (username.length < 3) {
        alert('Username must be at least 3 characters long.');
        return;
    }

    if (username.length > 20) {
        alert('Username cannot exceed 20 characters.');
        return;
    }

    // Check if username already exists
    const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY)) || {};
    const userKeyLower = username.toLowerCase();
    
    if (profiles[userKeyLower]) {
        // Username exists - attempt login
        loginToProfile(profiles[userKeyLower]);
        usernameInput.value = '';
        userBioInput.value = '';
        userColorInputs[0].checked = true;
        return;
    }

    // Create profile
    const profile = {
        username: username,
        bio: bio || 'No bio provided',
        color: color,
        joinDate: new Date().toLocaleDateString('en-US'),
        verified: generateVerificationCode(username),
        postCount: 0,
        createdAt: Date.now()
    };

    // Save profile
    profiles[userKeyLower] = profile;
    localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));

    // Set as current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));

    // Clear form
    usernameInput.value = '';
    userBioInput.value = '';
    userColorInputs[0].checked = true;

    // Update display
    displayCurrentUser();
    loadProfiles();
    
    alert(`Profile created! Your verification code: ${profile.verified}`);
}

function handleLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
    displayCurrentUser();
    loadProfiles();
    alert('Logged out successfully!');
}

function loginToProfile(profile) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(profile));
    displayCurrentUser();
    loadProfiles();
    alert(`Logged in as ${profile.username}!`);
}

function displayCurrentUser() {
    const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
    
    if (currentUser) {
        currentUserDisplay.innerHTML = `
            <div class="user-info">
                <div class="user-name" style="color: ${currentUser.color};">► ${currentUser.username}</div>
                <div class="user-detail">Status: ACTIVE</div>
                <div class="user-detail">Verification: ${currentUser.verified}</div>
                <div class="user-detail">Posts: ${currentUser.postCount || 0}</div>
                <div class="user-detail">Bio: ${escapeHtml(currentUser.bio)}</div>
                <div class="user-detail">Joined: ${currentUser.joinDate}</div>
            </div>
        `;
        userActionsDiv.style.display = 'block';
    } else {
        currentUserDisplay.innerHTML = '<span class="user-status">Not logged in - Create or login to a profile above</span>';
        userActionsDiv.style.display = 'none';
    }
}

function loadProfiles() {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY)) || {};
    const profileArray = Object.values(profiles).sort((a, b) => b.createdAt - a.createdAt);
    
    profilesList.innerHTML = '';

    if (profileArray.length === 0) {
        profilesList.innerHTML = '<div class="output-line">[No profiles registered yet]</div>';
        return;
    }

    profileArray.forEach(profile => {
        const profileItem = document.createElement('div');
        profileItem.className = 'profile-item';
        profileItem.style.cursor = 'pointer';
        profileItem.innerHTML = `
            <div class="profile-header">
                <span class="profile-username" style="color: ${profile.color};">${profile.username}</span>
                <span class="profile-verified">✓ ${profile.verified}</span>
            </div>
            <div class="profile-details">
                <span class="profile-bio">${escapeHtml(profile.bio)}</span>
                <span class="profile-joined">Joined: ${profile.joinDate} | Posts: ${profile.postCount || 0}</span>
                <span class="profile-action-hint" style="color: var(--text-dim); font-size: 0.75rem; margin-top: 4px;">Click to login</span>
            </div>
        `;
        profileItem.addEventListener('click', () => loginToProfile(profile));
        profilesList.appendChild(profileItem);
    });
}

function generateVerificationCode(username) {
    // Generate a simple verification code based on username
    const code = username.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 7).toUpperCase();
    return code;
}

function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function syncProfileData() {
    // Ensure profiles storage exists
    if (!localStorage.getItem(PROFILES_STORAGE_KEY)) {
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify({}));
    }
}

// Export function for forum.js to use
window.getCurrentUser = function() {
    return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null;
};

window.incrementPostCount = function(username) {
    const profiles = JSON.parse(localStorage.getItem(PROFILES_STORAGE_KEY)) || {};
    const userKey = username.toLowerCase();
    
    if (profiles[userKey]) {
        profiles[userKey].postCount = (profiles[userKey].postCount || 0) + 1;
        localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(profiles));
        
        // Update current user if it's the same
        const currentUser = JSON.parse(localStorage.getItem(CURRENT_USER_KEY));
        if (currentUser && currentUser.username.toLowerCase() === userKey) {
            currentUser.postCount = profiles[userKey].postCount;
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
            
            // Trigger UI update
            if (document.getElementById('currentUser')) {
                displayCurrentUser();
            }
        }
        
        // Trigger profiles list update
        if (document.getElementById('profilesList')) {
            loadProfiles();
        }
    }
};
