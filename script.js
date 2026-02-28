
// ========================================
// CUSTOM CURSOR SYSTEM
// ========================================
class CustomCursor {
    constructor() {
        this.cursor = null;
        this.cursorDot = null;
        this.pos = { x: 0, y: 0 };
        this.mousePos = { x: 0, y: 0 };
        this.trailElements = [];
        this.maxTrails = 15;
        this.isEnabled = !window.matchMedia('(pointer: coarse)').matches;

        this.init();
    }

    init() {
        if (!this.isEnabled) return;

        this.createCursorElements();
        this.addEventListeners();
        this.animate();
    }

    createCursorElements() {
        this.cursor = document.createElement('div');
        this.cursor.className = 'cursor';
        this.cursor.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.cursor);

        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'cursor-dot';
        this.cursorDot.setAttribute('aria-hidden', 'true');
        document.body.appendChild(this.cursorDot);
    }

    addEventListeners() {
        document.addEventListener('mousemove', (e) => {
            this.mousePos.x = e.clientX;
            this.mousePos.y = e.clientY;
            this.createTrail(e.clientX, e.clientY);
        });

        document.addEventListener('mousedown', () => {
            if (this.cursor) this.cursor.classList.add('active');
        });

        document.addEventListener('mouseup', () => {
            if (this.cursor) this.cursor.classList.remove('active');
        });

        // Hover effects for interactive elements
        const hoverElements = document.querySelectorAll('a, button, .bento-card, .project-card, input, textarea, .form__input, .form__textarea, .nav__link, .btn');
        hoverElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursor) this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                if (this.cursor) this.cursor.classList.remove('hover');
            });
        });
    }

    createTrail(x, y) {
        if (this.trailElements.length >= this.maxTrails) {
            const oldTrail = this.trailElements.shift();
            if (oldTrail && oldTrail.parentNode) {
                oldTrail.remove();
            }
        }

        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.left = x + 'px';
        trail.style.top = y + 'px';
        document.body.appendChild(trail);
        this.trailElements.push(trail);

        setTimeout(() => {
            if (trail.parentNode) {
                trail.remove();
            }
        }, 1000);
    }

    animate() {
        if (!this.cursor || !this.cursorDot) return;

        this.pos.x += (this.mousePos.x - this.pos.x) * 0.1;
        this.pos.y += (this.mousePos.y - this.pos.y) * 0.1;

        this.cursor.style.left = this.pos.x + 'px';
        this.cursor.style.top = this.pos.y + 'px';
        this.cursorDot.style.left = this.mousePos.x + 'px';
        this.cursorDot.style.top = this.mousePos.y + 'px';

        requestAnimationFrame(() => this.animate());
    }
}

// ========================================
// DARK MODE TOGGLE WITH LOCALSTORAGE
// ========================================
class DarkModeToggle {
    constructor() {
        this.themeToggleBtn = document.getElementById('theme-toggle');
        this.themeIcon = this.themeToggleBtn ? this.themeToggleBtn.querySelector('.icon-placeholder') : null;
        this.body = document.body;
        this.init();
    }

    init() {
        if (!this.themeToggleBtn) return;

        // Check LocalStorage for saved theme preference on page load
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'dark') {
            this.body.classList.add('dark-mode');
            if (this.themeIcon) this.themeIcon.textContent = '☀️';
        }

        // Listen for clicks on the theme button
        this.themeToggleBtn.addEventListener('click', () => {
            this.body.classList.toggle('dark-mode');

            if (this.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                if (this.themeIcon) this.themeIcon.textContent = '☀️';
            } else {
                localStorage.setItem('theme', 'light');
                if (this.themeIcon) this.themeIcon.textContent = '🌙';
            }

            // Dispatch custom event for other components
            window.dispatchEvent(new CustomEvent('themeChange', {
                detail: { theme: this.body.classList.contains('dark-mode') ? 'dark' : 'light' }
            }));
        });
    }
}

// ========================================
// HAMBURGER MENU (MOBILE)
// ========================================
class HamburgerMenu {
    constructor() {
        this.hamburgerBtn = document.querySelector('.hamburger');
        this.navLinks = document.querySelector('.nav-links');
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.hamburgerBtn || !this.navLinks) return;

        // Toggle menu visibility when hamburger is clicked
        this.hamburgerBtn.addEventListener('click', () => {
            this.toggle();
        });

        // Close mobile menu automatically when a link is clicked
        document.querySelectorAll('.nav__link').forEach(link => {
            link.addEventListener('click', () => {
                this.close();
            });
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isOpen &&
                !this.hamburgerBtn.contains(e.target) &&
                !this.navLinks.contains(e.target)) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.isOpen = true;
        this.hamburgerBtn.classList.add('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'true');
        this.navLinks.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen = false;
        this.hamburgerBtn.classList.remove('active');
        this.hamburgerBtn.setAttribute('aria-expanded', 'false');
        this.navLinks.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// SMOOTH SCROLLING
// ========================================
class SmoothScroll {
    constructor() {
        this.init();
    }

    init() {
        // Select all links that start with a hash (#)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = anchor.getAttribute('href');

                // Skip if the href is just a standalone "#"
                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
}

// ========================================
// DYNAMIC 3D CARD STACKING (PRESERVED)
// ========================================
class Dynamic3DCards {
    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        if (this.cards.length === 0) return;

        window.addEventListener('scroll', () => {
            this.cards.forEach((card, index) => {
                let scale = 1;

                // Loop through ALL cards that come after the current one
                for (let i = index + 1; i < this.cards.length; i++) {
                    const nextCard = this.cards[i];
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
    }
}

// ========================================
// SCROLL ANIMATIONS
// ========================================
class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.fade-in, .bento-card, .project-card, .about__image-wrapper, .about__content, .hero__title, .hero__subtitle, .hero__desc');
        this.init();
    }

    init() {
        const observer = new IntersectionObserver(
            (entries) => this.handleIntersection(entries),
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        this.elements.forEach((el, index) => {
            if (!el.classList.contains('fade-in')) {
                el.classList.add('fade-in');
                el.classList.add(`stagger-${(index % 5) + 1}`);
            }
            observer.observe(el);
        });
    }

    handleIntersection(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }
}

// ========================================
// NAVBAR SCROLL EFFECT
// ========================================
class NavbarScroll {
    constructor() {
        this.navbar = document.querySelector('.header');
        this.init();
    }

    init() {
        if (!this.navbar) return;

        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
        });
    }
}

// ========================================
// CONTACT FORM VALIDATION
// ========================================
class ContactForm {
    constructor() {
        this.form = document.querySelector('.contact__form');
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            message: formData.get('message')
        };

        // Validation
        if (!data.name || !data.email || !data.message) {
            this.showMessage('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(data.email)) {
            this.showMessage('Please enter a valid email address', 'error');
            return;
        }

        // Simulate form submission
        this.showMessage('Message sent successfully! ✓', 'success');
        this.form.reset();

        console.log('Form submitted:', data);
    }

    isValidEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    showMessage(message, type) {
        // Remove existing messages
        const existingMsg = this.form.querySelector('.form-message');
        if (existingMsg) existingMsg.remove();

        const msg = document.createElement('div');
        msg.className = `form-message ${type}`;
        msg.textContent = message;

        this.form.insertBefore(msg, this.form.firstChild);

        setTimeout(() => {
            if (msg.parentNode) {
                msg.remove();
            }
        }, 5000);
    }
}

// ========================================
// PARALLAX BACKGROUND EFFECT
// ========================================
class ParallaxEffect {
    constructor() {
        this.orbs = document.querySelectorAll('.bg-orb');
        this.init();
    }

    init() {
        if (this.orbs.length === 0) return;

        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        const scrolled = window.pageYOffset;

        this.orbs.forEach((orb, index) => {
            const speed = 0.1 + (index * 0.05);
            const yPos = scrolled * speed;
            orb.style.transform = `translateY(${yPos}px)`;
        });
    }
}

// ========================================
// ACTIVE NAVIGATION HIGHLIGHT
// ========================================
class ActiveNavigation {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.navLinks = document.querySelectorAll('.nav__link');
        this.init();
    }

    init() {
        if (this.sections.length === 0 || this.navLinks.length === 0) return;

        window.addEventListener('scroll', () => this.handleScroll());
    }

    handleScroll() {
        let current = '';

        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
}

// ========================================
// CLICK PARTICLE EFFECT
// ========================================
class ClickParticles {
    constructor() {
        this.init();
    }

    init() {
        document.addEventListener('click', (e) => {
            // Only create particles on main content clicks, not on buttons/links
            if (e.target.closest('a, button, input, textarea')) return;
            this.createParticles(e.clientX, e.clientY);
        });
    }

    createParticles(x, y) {
        const colors = ['#06b6d4', '#d946ef', '#8b5cf6', '#ec4899'];

        for (let i = 0; i < 12; i++) {
            const particle = document.createElement('div');
            const angle = (Math.PI * 2 * i) / 12;
            const velocity = 50 + Math.random() * 50;

            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                box-shadow: 0 0 15px currentColor;
            `;

            document.body.appendChild(particle);

            const destX = Math.cos(angle) * velocity;
            const destY = Math.sin(angle) * velocity;

            const animation = particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${destX}px, ${destY}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0, 0.9, 0.57, 1)'
            });

            animation.onfinish = () => {
                if (particle.parentNode) {
                    particle.remove();
                }
            };
        }
    }
}

// ========================================
// MAGNETIC BUTTON EFFECT
// ========================================
class MagneticButtons {
    constructor() {
        this.buttons = document.querySelectorAll('.btn');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => this.handleMove(e, btn));
            btn.addEventListener('mouseleave', () => this.handleLeave(btn));
        });
    }

    handleMove(e, btn) {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
    }

    handleLeave(btn) {
        btn.style.transform = 'translate(0, 0)';
    }
}

// ========================================
// RESUME DOWNLOAD MANAGER (ANTI-SPAM)
// ========================================
class ResumeDownloadManager {
    constructor() {
        this.downloadBtn = document.querySelector('a[href*="resume.pdf"]');
        this.cooldownMinutes = 5; // User has to wait 5 minutes between downloads
        this.init();
    }

    init() {
        if (!this.downloadBtn) return;

        this.downloadBtn.addEventListener('click', (e) => this.handleDownload(e));
    }

    handleDownload(e) {
        const lastDownloadTime = localStorage.getItem('lastResumeDownload');
        const currentTime = new Date().getTime();

        if (lastDownloadTime) {
            const timeDiff = currentTime - parseInt(lastDownloadTime, 10);
            const minutesDiff = Math.floor(timeDiff / 1000 / 60);

            if (minutesDiff < this.cooldownMinutes) {
                e.preventDefault(); // Stop the download
                const waitTime = this.cooldownMinutes - minutesDiff;

                // Use the existing ContactForm message system to show an alert, or a basic alert if missing
                alert(`Security Protection: Please wait ${waitTime} minute(s) before downloading the resume again.`);
                return;
            }
        }

        // Allow download and set new time
        localStorage.setItem('lastResumeDownload', currentTime.toString());
    }
}

// ========================================
// PERFORMANCE UTILITIES
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function (...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// INITIALIZE ALL MODULES
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    new CustomCursor();
    new DarkModeToggle();
    new HamburgerMenu();
    new SmoothScroll();
    new Dynamic3DCards();      // ✅ PRESERVED - Your 3D card stacking logic
    new ScrollAnimations();
    new NavbarScroll();
    new ContactForm();
    new ParallaxEffect();
    new ActiveNavigation();
    new ClickParticles();
    new MagneticButtons();
    new ResumeDownloadManager(); // Enable anti-spam downloads

    // Console branding
    console.log('%c🚀 Portfolio Loaded Successfully!', 'color: #06b6d4; font-size: 24px; font-weight: bold;');
    console.log('%cBuilt with Web3 Design Style | Yosef Praditia', 'color: #d946ef; font-size: 14px;');
    console.log('%cFeatures: Custom Cursor, Dark Mode, 3D Cards, Animations', 'color: #8b5cf6; font-size: 12px;');
});

// ========================================
// ERROR HANDLING
// ========================================
window.addEventListener('error', (e) => {
    console.error('Portfolio Error:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
});
