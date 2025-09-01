// Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar scroll effect
let lastScrollTop = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 100) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
    }
    
    // Add/remove background blur based on scroll position
    if (scrollTop > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(20px)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.9)';
        navbar.style.backdropFilter = 'blur(10px)';
    }
    
    lastScrollTop = scrollTop;
});

// Animated counter for hero stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start).toLocaleString();
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target.toLocaleString();
        }
    }
    
    updateCounter();
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            
            // Animate counters when hero stats come into view
            if (entry.target.classList.contains('hero-stats')) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach((stat, index) => {
                    setTimeout(() => {
                        const target = parseFloat(stat.textContent);
                        if (stat.textContent.includes('%')) {
                            animateCounter(stat, target, 1500);
                            stat.textContent += '%';
                        } else if (stat.textContent.includes('M+')) {
                            animateCounter(stat, target, 1500);
                            stat.textContent = Math.floor(target) + 'M+';
                        } else if (stat.textContent.includes('K+')) {
                            animateCounter(stat, target, 1500);
                            stat.textContent = Math.floor(target) + 'K+';
                        }
                    }, index * 200);
                });
            }
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.feature-card, .step, .hero-stats, .section-header').forEach(el => {
    observer.observe(el);
});

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .feature-card,
    .step,
    .section-header {
        opacity: 0;
        transform: translateY(30px);
        transition: all 0.6s ease;
    }
    
    .feature-card.animate-in,
    .step.animate-in,
    .section-header.animate-in {
        opacity: 1;
        transform: translateY(0);
    }
    
    .hero-stats {
        opacity: 0;
        transition: opacity 0.6s ease;
    }
    
    .hero-stats.animate-in {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Parallax effect for floating circles
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.floating-circle');
    
    circles.forEach((circle, index) => {
        const speed = 0.5 + (index * 0.1);
        circle.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Typing animation for hero
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.textContent = '';
    
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Initialize typing animation when page loads
window.addEventListener('load', () => {
    const typingElement = document.querySelector('.typing-text');
    if (typingElement) {
        const originalText = typingElement.textContent;
        typeWriter(typingElement, originalText, 30);
    }
});

// Button hover effects
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px) scale(1.02)';
    });
    
    button.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Feature card hover effects
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Phone showcase interaction
const phoneShowcase = document.querySelector('.phone');
if (phoneShowcase) {
    phoneShowcase.addEventListener('mouseenter', function() {
        this.style.transform = 'rotate(0deg) scale(1.05)';
    });
    
    phoneShowcase.addEventListener('mouseleave', function() {
        this.style.transform = 'rotate(-5deg) scale(1)';
    });
}

// Loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// Add loading styles
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    .hero-content {
        transform: translateY(30px);
        opacity: 0;
        animation: fadeInUp 1s ease 0.3s forwards;
    }
    
    @keyframes fadeInUp {
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(loadingStyle);

// Add scroll progress indicator
const scrollProgress = document.createElement('div');
scrollProgress.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 0%;
    height: 3px;
    background: linear-gradient(135deg, #667eea, #764ba2);
    z-index: 9999;
    transition: width 0.1s ease;
`;
document.body.appendChild(scrollProgress);

window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    scrollProgress.style.width = scrolled + '%';
});

// Add easter egg - Konami code
let konamiCode = [];
const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]; // Up, Up, Down, Down, Left, Right, Left, Right, B, A

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.keyCode);
    konamiCode = konamiCode.slice(-10);
    
    if (konamiCode.toString() === konamiSequence.toString()) {
        // Easter egg animation
        document.querySelectorAll('.floating-circle').forEach((circle, index) => {
            setTimeout(() => {
                circle.style.animation = 'spin 1s ease-in-out';
                circle.style.opacity = '0.3';
            }, index * 100);
        });
        
        setTimeout(() => {
            alert('🎉 You found the easter egg! MILLens+ developers appreciate curious users like you!');
        }, 500);
    }
});

// Add spin animation for easter egg
const easterEggStyle = document.createElement('style');
easterEggStyle.textContent = `
    @keyframes spin {
        from { transform: rotate(0deg) scale(1); }
        to { transform: rotate(360deg) scale(1.2); }
    }
`;
document.head.appendChild(easterEggStyle);
