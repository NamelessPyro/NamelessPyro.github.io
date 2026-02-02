// Configuration
const CONFIG = {
    PASSWORD: 'password123',
    MAX_FILE_SIZE: 10 * 1024 * 1024
};

// File upload handling
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById('fileInput');
    const uploadBox = document.querySelector('.upload-box');
    const passwordInput = document.getElementById('uploadPassword');
    const fileListContainer = document.getElementById('fileListContainer');

    // Drag and drop functionality
    uploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('drag-over');
    });

    uploadBox.addEventListener('dragleave', () => {
        uploadBox.classList.remove('drag-over');
    });

    uploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // Click to select files
    uploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Add delete button for each file
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-file')) {
            const fileName = e.target.dataset.name;
            deleteFile(fileName);
        }
    });

    function handleFiles(files) {
        if (files.length === 0) return;

        const password = passwordInput.value.trim();

        if (!password) {
            alert('Please enter a password to upload files.');
            return;
        }

        if (password !== CONFIG.PASSWORD) {
            alert('Incorrect password. Upload denied.');
            return;
        }

        Array.from(files).forEach(file => {
            if (file.size > CONFIG.MAX_FILE_SIZE) {
                alert(`File "${file.name}" is too large. Max size is 10MB.`);
                return;
            }
            addFileToList(file);
        });

        passwordInput.value = '';
    }

    function addFileToList(file) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        
        const date = new Date().toLocaleDateString('en-US');
        const time = new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false 
        });
        const size = formatFileSize(file.size);
        
        fileItem.innerHTML = `
            <span class="col-date">${date}</span>
            <span class="col-time">${time}</span>
            <span class="col-size">${size}</span>
            <span class="col-name file-link" data-name="${file.name}">${file.name}</span>
            <span class="delete-file" data-name="${file.name}" title="Delete">×</span>
        `;
        
        fileListContainer.appendChild(fileItem);

        // Store file in localStorage
        storeFile(file);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
    }

    function storeFile(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const fileData = {
                name: file.name,
                type: file.type,
                size: file.size,
                data: e.target.result,
                date: new Date().toLocaleDateString('en-US'),
                time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
            };
            
            let files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
            files.push(fileData);
            localStorage.setItem('uploadedFiles', JSON.stringify(files));
        };
        reader.readAsArrayBuffer(file);
    }

    // Load files on page load
    loadStoredFiles();
});

function loadStoredFiles() {
    const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const fileListContainer = document.getElementById('fileListContainer');
    
    fileListContainer.innerHTML = '';
    
    if (files.length > 0) {
        files.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <span class="col-date">${file.date}</span>
                <span class="col-time">${file.time}</span>
                <span class="col-size">${formatFileSize(file.size)}</span>
                <span class="col-name file-link" onclick="downloadFile('${file.name}')">${file.name}</span>
                <span class="delete-file" data-name="${file.name}" title="Delete">×</span>
            `;
            fileListContainer.appendChild(fileItem);
        });
    } else {
        fileListContainer.innerHTML = '<div class="file-item"><span class="col-date">--</span><span class="col-time">--</span><span class="col-size">--</span><span class="col-name">[EMPTY]</span></div>';
    }
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
}

function downloadFile(fileName) {
    const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const file = files.find(f => f.name === fileName);
    
    if (file) {
        const blob = new Blob([new Uint8Array(Object.values(file.data))], { type: file.type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
}

function deleteFile(fileName) {
    const files = JSON.parse(localStorage.getItem('uploadedFiles')) || [];
    const updatedFiles = files.filter(f => f.name !== fileName);
    localStorage.setItem('uploadedFiles', JSON.stringify(updatedFiles));
    loadStoredFiles();
}

// Smooth scroll for any anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
