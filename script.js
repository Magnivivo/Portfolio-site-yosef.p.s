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