// Data reveal animation on page load
document.addEventListener('DOMContentLoaded', function() {
    const dataLines = document.querySelectorAll('.data-line');
    const dataSections = document.querySelectorAll('.data-section');
    
    // Stagger animation for sections
    dataSections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s forwards`;
    });

    // Stagger animation for data lines
    dataLines.forEach((line, index) => {
        line.style.opacity = '0';
        line.style.animation = `fadeInUp 0.4s ease-out ${0.3 + index * 0.05}s forwards`;
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



