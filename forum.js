// Configuration
const CONFIG = {
    PASSWORD: 'SalemAngel1388'
};

// DOM Elements
const forumContainer = document.getElementById('forumContainer');
const postPasswordInput = document.getElementById('postPassword');
const postTitleInput = document.getElementById('postTitle');
const postContentInput = document.getElementById('postContent');
const submitPostBtn = document.getElementById('submitPost');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPosts();
    setupEventListeners();
});

function setupEventListeners() {
    submitPostBtn.addEventListener('click', handleCreatePost);
    
    // Allow Enter+Ctrl to submit (terminal style)
    postContentInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            handleCreatePost();
        }
    });
}

function handleCreatePost() {
    const password = postPasswordInput.value.trim();
    const title = postTitleInput.value.trim();
    const content = postContentInput.value.trim();

    if (!password) {
        alert('Please enter the password to create a post.');
        return;
    }

    if (password !== CONFIG.PASSWORD) {
        alert('Incorrect password. Post creation denied.');
        return;
    }

    if (!title) {
        alert('Please enter a thread title.');
        return;
    }

    if (!content) {
        alert('Please enter message content.');
        return;
    }

    // Create post object
    const post = {
        id: Date.now(),
        title: title,
        content: content,
        author: 'Anonymous',
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        replies: []
    };

    // Save to localStorage
    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    posts.unshift(post);
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    // Clear inputs
    postPasswordInput.value = '';
    postTitleInput.value = '';
    postContentInput.value = '';

    // Reload posts
    loadPosts();

    alert('Thread created successfully!');
}

function loadPosts() {
    const posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    
    forumContainer.innerHTML = '';

    if (posts.length === 0) {
        forumContainer.innerHTML = '<div class="output-line">[No threads yet. Be the first to post!]</div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        forumContainer.appendChild(postElement);
    });
}

function createPostElement(post) {
    const postDiv = document.createElement('div');
    postDiv.className = 'forum-post';
    postDiv.dataset.postId = post.id;

    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    postHeader.innerHTML = `
        <span class="post-title">${escapeHtml(post.title)}</span>
        <span class="post-meta">by ${post.author} | ${post.date} ${post.time}</span>
        <span class="delete-post" data-post-id="${post.id}" title="Delete">×</span>
    `;

    const postBody = document.createElement('div');
    postBody.className = 'post-body';
    postBody.innerHTML = `<div class="post-content">${escapeHtml(post.content)}</div>`;

    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'post-replies';
    
    if (post.replies && post.replies.length > 0) {
        post.replies.forEach(reply => {
            const replyElement = createReplyElement(reply, post.id);
            repliesDiv.appendChild(replyElement);
        });
    }

    const replyForm = document.createElement('div');
    replyForm.className = 'reply-form';
    replyForm.innerHTML = `
        <input type="text" class="reply-author" placeholder="Name (optional)" data-post-id="${post.id}">
        <textarea class="reply-content" placeholder="Write a reply..." data-post-id="${post.id}"></textarea>
        <button class="reply-btn" data-post-id="${post.id}">Post Reply</button>
    `;

    postDiv.appendChild(postHeader);
    postDiv.appendChild(postBody);
    postDiv.appendChild(repliesDiv);
    postDiv.appendChild(replyForm);

    // Setup reply button
    replyForm.querySelector('.reply-btn').addEventListener('click', () => {
        handleCreateReply(post.id);
    });

    // Setup delete post button
    postHeader.querySelector('.delete-post').addEventListener('click', () => {
        deletePost(post.id);
    });

    return postDiv;
}

function createReplyElement(reply, postId) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'forum-reply';
    replyDiv.innerHTML = `
        <div class="reply-header">
            <span class="reply-author">${reply.author}</span>
            <span class="reply-meta">${reply.date} ${reply.time}</span>
            <span class="delete-reply" data-post-id="${postId}" data-reply-id="${reply.id}" title="Delete">×</span>
        </div>
        <div class="reply-content">${escapeHtml(reply.content)}</div>
    `;

    replyDiv.querySelector('.delete-reply').addEventListener('click', () => {
        deleteReply(postId, reply.id);
    });

    return replyDiv;
}

function handleCreateReply(postId) {
    const form = document.querySelector(`.reply-form[data-post-id="${postId}"]`);
    const authorInput = form.querySelector('.reply-author');
    const contentInput = form.querySelector('.reply-content');

    const author = authorInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();

    if (!content) {
        alert('Please write a reply.');
        return;
    }

    // Find and update post
    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const post = posts.find(p => p.id === postId);

    if (post) {
        if (!post.replies) post.replies = [];

        const reply = {
            id: Date.now(),
            author: author,
            content: content,
            date: new Date().toLocaleDateString('en-US'),
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
        };

        post.replies.push(reply);
        localStorage.setItem('forumPosts', JSON.stringify(posts));

        // Clear inputs
        authorInput.value = '';
        contentInput.value = '';

        // Reload posts
        loadPosts();
    }
}

function deletePost(postId) {
    if (confirm('Delete this thread?')) {
        let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        posts = posts.filter(p => p.id !== postId);
        localStorage.setItem('forumPosts', JSON.stringify(posts));
        loadPosts();
    }
}

function deleteReply(postId, replyId) {
    if (confirm('Delete this reply?')) {
        let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
        const post = posts.find(p => p.id === postId);
        
        if (post && post.replies) {
            post.replies = post.replies.filter(r => r.id !== replyId);
            localStorage.setItem('forumPosts', JSON.stringify(posts));
            loadPosts();
        }
    }
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
