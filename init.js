// Global Initialization Handler
// This ensures all modules load in correct order

(function() {
    'use strict';

    // Track module status
    const modules = {
        firebase: false,
        profiles: false,
        forum: false
    };

    // Check Firebase
    function checkFirebase() {
        return typeof firebase !== 'undefined' && typeof database !== 'undefined';
    }

    // Check Profiles
    function checkProfiles() {
        return typeof window.getCurrentUser === 'function';
    }

    // Check Forum
    function checkForum() {
        return typeof window.loadPosts === 'function';
    }

    // Wait for all modules
    function waitForModules(callback, timeout = 5000) {
        const startTime = Date.now();
        
        function check() {
            modules.firebase = checkFirebase();
            modules.profiles = checkProfiles();
            modules.forum = checkForum();

            const allReady = modules.firebase || !checkFirebase(); // Firebase is optional
            const profilesReady = modules.profiles || document.body.classList.contains('no-profiles');
            const forumReady = modules.forum || document.body.classList.contains('no-forum');

            if ((allReady && profilesReady && forumReady) || (Date.now() - startTime > timeout)) {
                console.log('Modules loaded:', modules);
                callback();
            } else {
                setTimeout(check, 100);
            }
        }

        check();
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        waitForModules(() => {
            console.log('All modules initialized successfully');
            
            // Trigger any deferred initialization
            if (window.onModulesReady) {
                window.onModulesReady();
            }
        });
    });

    // Export for debugging
    window.ModuleStatus = modules;
})();
