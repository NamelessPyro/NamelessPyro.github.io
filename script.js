// Terminal typing animation
document.addEventListener('DOMContentLoaded', function() {
    const terminalLines = document.querySelectorAll('.terminal-line');
    const terminalOutput = document.querySelectorAll('.terminal-output');
    
    // Stagger animation for each line
    terminalLines.forEach((line, index) => {
        line.style.animationDelay = `${index * 0.3}s`;
    });

    terminalOutput.forEach((output, index) => {
        output.style.opacity = '0';
        output.style.animation = `typewrite 0.5s ease-out ${(index + 1) * 0.3}s forwards`;
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


