// Terminal command animation
document.addEventListener('DOMContentLoaded', function() {
    const commandLines = document.querySelectorAll('.command-line');
    const outputSections = document.querySelectorAll('.output-section');
    
    // Stagger animations for command lines
    commandLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.15}s`;
    });

    // Stagger animations for output sections
    outputSections.forEach((section, index) => {
        section.style.animationDelay = `${0.1 + index * 0.2}s`;
    });
});

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




