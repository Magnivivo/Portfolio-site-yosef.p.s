// ================= DARK MODE TOGGLE =================
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = themeToggleBtn.querySelector('.icon-placeholder');
const body = document.body;

// 1. Check LocalStorage for saved theme preference on page load
const currentTheme = localStorage.getItem('theme');
if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.textContent = '☀️'; // Change icon to sun if dark mode is active
}

// 2. Listen for clicks on the theme button
themeToggleBtn.addEventListener('click', () => {
    // Toggle the dark-mode class on the body
    body.classList.toggle('dark-mode');
    
    // Save preference to LocalStorage and swap the icon
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.textContent = '☀️';
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.textContent = '🌙';
    }
});

// ================= HAMBURGER MENU (MOBILE) =================
const hamburgerBtn = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

// Toggle menu visibility when hamburger is clicked
hamburgerBtn.addEventListener('click', () => {
    const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
    hamburgerBtn.setAttribute('aria-expanded', !isExpanded);
    navLinks.classList.toggle('active');
});

// Close mobile menu automatically when a link is clicked
document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        navLinks.classList.remove('active');
    });
});

// ================= SMOOTH SCROLLING =================
// Select all links that start with a hash (#)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default instant jump
        const targetId = this.getAttribute('href');
        
        // Skip if the href is just a standalone "#"
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ================= DYNAMIC 3D CARD STACKING =================
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.project-card');

    window.addEventListener('scroll', () => {
        cards.forEach((card, index) => {
            let scale = 1;
            
            // Loop through ALL cards that come after the current one
            for (let i = index + 1; i < cards.length; i++) {
                const nextCard = cards[i];
                const cardRect = card.getBoundingClientRect();
                const nextRect = nextCard.getBoundingClientRect();
                
                // Calculate the distance between the top edges
                const distance = nextRect.top - cardRect.top;
                
                // If the next card gets within 600px, it starts "pressing down" on this card
                if (distance < 600) {
                    // Converts distance into a percentage (0.0 to 1.0)
                    const progress = 1 - (distance / 600);
                    // Shrink the card by 5% for EVERY card that stacks on top of it
                    scale -= (0.05 * progress); 
                }
            }
            
            // Safety cap so it doesn't shrink into oblivion
            scale = Math.max(0.7, scale);
            
            // Apply the new accumulated scale!
            card.style.transform = `scale(${scale})`;
        });
    });
});