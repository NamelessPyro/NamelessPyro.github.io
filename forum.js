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
        author: 'NamelessPyro',
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        score: 1,
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
    postDiv.className = 'reddit-post';
    postDiv.dataset.postId = post.id;

    const postVote = document.createElement('div');
    postVote.className = 'post-vote';
    postVote.innerHTML = `
        <button class="vote-up" data-post-id="${post.id}" title="Upvote">▲</button>
        <span class="score">${post.score}</span>
        <button class="vote-down" data-post-id="${post.id}" title="Downvote">▼</button>
    `;

    const postContent = document.createElement('div');
    postContent.className = 'post-content-wrapper';
    
    const postHeader = document.createElement('div');
    postHeader.className = 'post-header';
    postHeader.innerHTML = `
        <span class="post-title">${escapeHtml(post.title)}</span>
    `;

    const postMeta = document.createElement('div');
    postMeta.className = 'post-meta';
    postMeta.innerHTML = `
        submitted by <span class="author">${post.author}</span> 
        to <span class="subreddit">/forum</span> 
        on ${post.date} at ${post.time}
        <span class="post-actions">
            <span class="comments-link">${(post.replies || []).length} comments</span>
            <span class="separator">•</span>
            <span class="delete-post" data-post-id="${post.id}" title="Delete">delete</span>
        </span>
    `;

    const postBody = document.createElement('div');
    postBody.className = 'post-body';
    postBody.innerHTML = `<div class="post-text">${escapeHtml(post.content)}</div>`;

    const repliesDiv = document.createElement('div');
    repliesDiv.className = 'comments-section';
    
    if (post.replies && post.replies.length > 0) {
        post.replies.forEach(reply => {
            const replyElement = createReplyElement(reply, post.id);
            repliesDiv.appendChild(replyElement);
        });
    }

    const replyForm = document.createElement('div');
    replyForm.className = 'comment-form';
    replyForm.innerHTML = `
        <div class="form-group">
            <input type="text" class="reply-author" placeholder="name (optional)" data-post-id="${post.id}">
            <textarea class="reply-content" placeholder="what are your thoughts?" data-post-id="${post.id}"></textarea>
            <button class="reply-btn" data-post-id="${post.id}">save</button>
        </div>
    `;

    postContent.appendChild(postHeader);
    postContent.appendChild(postMeta);
    postContent.appendChild(postBody);
    postContent.appendChild(repliesDiv);
    postContent.appendChild(replyForm);

    postDiv.appendChild(postVote);
    postDiv.appendChild(postContent);

    // Setup event listeners
    replyForm.querySelector('.reply-btn').addEventListener('click', () => {
        handleCreateReply(post.id);
    });

    postHeader.querySelector('.post-title').addEventListener('click', () => {
        toggleComments(postDiv);
    });

    postMeta.querySelector('.delete-post').addEventListener('click', () => {
        deletePost(post.id);
    });

    postVote.querySelector('.vote-up').addEventListener('click', () => {
        votePost(post.id, 1);
    });

    postVote.querySelector('.vote-down').addEventListener('click', () => {
        votePost(post.id, -1);
    });

    return postDiv;
}

function createReplyElement(reply, postId, depth = 0) {
    const replyDiv = document.createElement('div');
    replyDiv.className = 'comment';
    replyDiv.style.marginLeft = (depth * 30) + 'px';

    const commentVote = document.createElement('div');
    commentVote.className = 'comment-vote';
    commentVote.innerHTML = `
        <button class="vote-comment-up" title="Upvote">▲</button>
        <span class="score">${reply.score || 0}</span>
        <button class="vote-comment-down" title="Downvote">▼</button>
    `;

    const commentContent = document.createElement('div');
    commentContent.className = 'comment-content';

    const commentHeader = document.createElement('div');
    commentHeader.className = 'comment-header';
    commentHeader.innerHTML = `
        <span class="author">${reply.author}</span> 
        <span class="timestamp">${reply.date} ${reply.time}</span>
        <span class="comment-actions">
            <span class="delete-reply" data-post-id="${postId}" data-reply-id="${reply.id}" title="Delete">delete</span>
        </span>
    `;

    const commentBody = document.createElement('div');
    commentBody.className = 'comment-text';
    commentBody.innerHTML = escapeHtml(reply.content);

    const commentMeta = document.createElement('div');
    commentMeta.className = 'comment-meta';
    commentMeta.innerHTML = `<span class="reply-action" data-post-id="${postId}" data-reply-id="${reply.id}">reply</span>`;

    commentContent.appendChild(commentHeader);
    commentContent.appendChild(commentBody);
    commentContent.appendChild(commentMeta);

    replyDiv.appendChild(commentVote);
    replyDiv.appendChild(commentContent);

    // Event listeners
    commentMeta.querySelector('.reply-action').addEventListener('click', () => {
        toggleReplyForm(replyDiv, postId, reply.id);
    });

    replyDiv.querySelector('.delete-reply').addEventListener('click', () => {
        deleteReply(postId, reply.id);
    });

    // Nested replies
    if (reply.nested_replies && reply.nested_replies.length > 0) {
        reply.nested_replies.forEach(nestedReply => {
            const nestedElement = createReplyElement(nestedReply, postId, depth + 1);
            replyDiv.appendChild(nestedElement);
        });
    }

    return replyDiv;
}

function toggleComments(postElement) {
    const commentsSection = postElement.querySelector('.comments-section');
    const commentForm = postElement.querySelector('.comment-form');
    
    if (commentsSection.style.display === 'none') {
        commentsSection.style.display = 'block';
        commentForm.style.display = 'block';
    } else {
        commentsSection.style.display = 'none';
        commentForm.style.display = 'none';
    }
}

function toggleReplyForm(replyElement, postId, replyId) {
    let form = replyElement.querySelector('.nested-reply-form');
    
    if (form) {
        form.remove();
    } else {
        const formDiv = document.createElement('div');
        formDiv.className = 'nested-reply-form';
        formDiv.innerHTML = `
            <input type="text" class="reply-author" placeholder="name (optional)" data-post-id="${postId}" data-reply-id="${replyId}">
            <textarea class="reply-content" placeholder="what are your thoughts?" data-post-id="${postId}" data-reply-id="${replyId}"></textarea>
            <button class="reply-btn nested" data-post-id="${postId}" data-reply-id="${replyId}">save</button>
        `;
        
        formDiv.querySelector('.reply-btn').addEventListener('click', () => {
            handleCreateNestedReply(postId, replyId);
        });
        
        replyElement.appendChild(formDiv);
        formDiv.querySelector('.reply-author').focus();
    }
}

function handleCreateReply(postId) {
    const form = document.querySelector(`.comment-form[data-post-id="${postId}"]`);
    if (!form) return;
    
    const authorInput = form.querySelector('.reply-author');
    const contentInput = form.querySelector('.reply-content');

    const author = authorInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();

    if (!content) {
        alert('Please write a comment.');
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
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
            score: 0,
            nested_replies: []
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

function handleCreateNestedReply(postId, replyId) {
    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const post = posts.find(p => p.id === postId);

    if (!post) return;

    const reply = post.replies.find(r => r.id === replyId);
    if (!reply) return;

    // Find the nested form
    const postElement = document.querySelector(`[data-post-id="${postId}"]`);
    const replyElement = postElement.querySelector(`[data-reply-id="${replyId}"]`);
    
    if (!replyElement) return;

    const form = replyElement.querySelector('.nested-reply-form');
    const authorInput = form.querySelector('.reply-author');
    const contentInput = form.querySelector('.reply-content');

    const author = authorInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();

    if (!content) {
        alert('Please write a comment.');
        return;
    }

    if (!reply.nested_replies) reply.nested_replies = [];

    const nestedReply = {
        id: Date.now(),
        author: author,
        content: content,
        date: new Date().toLocaleDateString('en-US'),
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        score: 0,
        nested_replies: []
    };

    reply.nested_replies.push(nestedReply);
    localStorage.setItem('forumPosts', JSON.stringify(posts));

    loadPosts();
}

function votePost(postId, direction) {
    let posts = JSON.parse(localStorage.getItem('forumPosts')) || [];
    const post = posts.find(p => p.id === postId);
    
    if (post) {
        post.score += direction;
        localStorage.setItem('forumPosts', JSON.stringify(posts));
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
    if (confirm('Delete this comment?')) {
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
