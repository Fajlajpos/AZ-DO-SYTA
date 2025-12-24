// ===== Smooth Scrolling Navigation =====
let isScrollingFromClick = false;
let scrollTimeout;

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            // Immediately update active state on click
            document.querySelectorAll('.nav-link').forEach(navLink => {
                navLink.classList.remove('active');
            });
            this.classList.add('active');

            // Set flag to prevent observer from changing active state
            isScrollingFromClick = true;

            // Clear any existing timeout
            if (scrollTimeout) clearTimeout(scrollTimeout);

            const navHeight = document.querySelector('.navbar').offsetHeight;
            const extraOffset = 20;
            const targetPosition = targetSection.offsetTop - navHeight - extraOffset;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });

            // Re-enable observer after scroll completes
            scrollTimeout = setTimeout(() => {
                isScrollingFromClick = false;
            }, 1000);

            // Close mobile menu if open
            document.getElementById('navMenu')?.classList.remove('active');
        }
    });
});

// ===== CTA Button Smooth Scroll =====
document.querySelector('.cta-button')?.addEventListener('click', function (e) {
    e.preventDefault();
    const targetId = this.getAttribute('href');
    const targetSection = document.querySelector(targetId);

    if (targetSection) {
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const extraOffset = 20;
        const targetPosition = targetSection.offsetTop - navHeight - extraOffset;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
});

// ===== Performance Optimized Active Navigation Link (IntersectionObserver) =====
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserverOptions = {
    threshold: 0.3,
    rootMargin: "-100px 0px -50% 0px" // Trigger when section is near top/center
};

const sectionObserver = new IntersectionObserver((entries) => {
    if (isScrollingFromClick) return;

    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, sectionObserverOptions);

document.querySelectorAll('section[id]').forEach(section => {
    sectionObserver.observe(section);
});

// ===== Mobile Menu Toggle =====
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.getElementById('navMenu');

mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.toggle('active');
});

// ===== Scroll Animations (Reveal on Scroll) =====
const revealObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target); // Stop observing once revealed
        }
    });
}, revealObserverOptions);

document.querySelectorAll('.menu-item, .about-block, .info-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    revealObserver.observe(el);
});

// ===== Optimized Scroll Handler (RAF) =====
// Handles Navbar Shadow, Back to Top, and Parallax
const navbar = document.getElementById('navbar');
const backToTopButton = document.getElementById('backToTop');
const heroSection = document.querySelector('.hero-section');
let isTicking = false;

function onScroll() {
    const scrollY = window.scrollY;

    // Navbar Shadow
    if (navbar) {
        if (scrollY > 50) {
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.15)';
        } else {
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }
    }

    // Back to Top Button
    if (backToTopButton) {
        if (scrollY > 500) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Parallax Effect (Optimized with translate3d)
    if (heroSection && scrollY < window.innerHeight) {
        // use translate3d to force hardware acceleration
        heroSection.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    }

    isTicking = false;
}

window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(onScroll);
        isTicking = true;
    }
}, { passive: true });


// ===== Form Validation & Submission =====
const reservationForm = document.getElementById('reservationForm');

reservationForm?.addEventListener('submit', function (e) {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        guests: document.getElementById('guests').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        message: document.getElementById('message').value
    };

    if (!formData.name || !formData.email || !formData.phone || !formData.guests || !formData.date || !formData.time) {
        alert('Prosím vyplňte všechna povinná pole.');
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Prosím zadejte platnou e-mailovou adresu.');
        return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        alert('Prosím vyberte budoucí datum.');
        return;
    }

    alert(`Děkujeme za rezervaci, ${formData.name}!\n\nVaše rezervace:\nDatum: ${formData.date}\nČas: ${formData.time}\nPočet hostů: ${formData.guests}\n\nBrzy vás budeme kontaktovat na ${formData.email} pro potvrzení.`);
    reservationForm.reset();
});

// ===== Set Minimum Date for Reservation =====
const dateInput = document.getElementById('date');
if (dateInput) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    dateInput.setAttribute('min', minDate);
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', () => {
    // Reveal Hero Content
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });

    // Set initial theme
    const preferredTheme = getPreferredTheme();
    setTheme(preferredTheme);
});

// ===== Back to Top Actions =====
backToTopButton?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== Dark Mode Toggle =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function getPreferredTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggle) themeToggle.checked = theme === 'dark';
}

themeToggle?.addEventListener('change', () => {
    setTheme(themeToggle.checked ? 'dark' : 'light');
});
