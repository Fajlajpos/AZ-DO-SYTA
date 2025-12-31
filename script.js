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

// IntersectionObserver removed in favor of scroll-based detection in onScroll

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

    // Parallax Effect
    if (heroSection && scrollY < window.innerHeight) {
        heroSection.style.transform = `translate3d(0, ${scrollY * 0.4}px, 0)`;
    }

    // Active Link Detection (Restored Scroll Spy)
    if (!isScrollingFromClick) {
        const sections = document.querySelectorAll('section');
        const navLinks = document.querySelectorAll('.nav-link');
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionId = section.getAttribute('id');
            // Trigger when section top is near viewport top (minus navbar offset)
            if (scrollY >= (sectionTop - 150)) {
                current = sectionId;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    isTicking = false;
}

window.addEventListener('scroll', () => {
    if (!isTicking) {
        window.requestAnimationFrame(onScroll);
        isTicking = true;
    }
}, { passive: true });


// ===== Email Copy Functionality =====
function copyEmail() {
    const email = document.getElementById('contactEmail').innerText;
    const tooltip = document.getElementById('copyTooltip');

    navigator.clipboard.writeText(email).then(() => {
        // Show tooltip
        tooltip.classList.add('visible');

        // Hide after 2 seconds
        setTimeout(() => {
            tooltip.classList.remove('visible');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
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


// ===== Lightbox Gallery =====
const lightbox = document.getElementById('lightbox');
const lightboxImage = document.querySelector('.lightbox-image');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDesc = document.getElementById('lightboxDesc');
const closeBtn = document.querySelector('.lightbox-close');
const prevBtn = document.querySelector('.lightbox-prev');
const nextBtn = document.querySelector('.lightbox-next');

let menuItemsData = [];
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.menu-info h3').innerText;
        const desc = item.querySelector('.menu-info p').innerText;

        menuItemsData.push({
            src: img.src,
            alt: img.alt,
            title: title,
            desc: desc
        });

        // Add click listener to the image container
        const imageContainer = item.querySelector('.menu-image');
        imageContainer.addEventListener('click', () => {
            openLightbox(index);
        });
    });
});

function openLightbox(index) {
    currentImageIndex = index;
    updateLightboxContent();
    lightbox.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
}

function closeLightbox() {
    lightbox.classList.remove('visible');
    document.body.style.overflow = '';
}

function updateLightboxContent() {
    const data = menuItemsData[currentImageIndex];
    lightboxImage.src = data.src;
    lightboxImage.alt = data.alt;
    lightboxTitle.innerText = data.title;
    lightboxDesc.innerText = data.desc;
}

function showNext() {
    currentImageIndex = (currentImageIndex + 1) % menuItemsData.length;
    updateLightboxContent();
}

function showPrev() {
    currentImageIndex = (currentImageIndex - 1 + menuItemsData.length) % menuItemsData.length;
    updateLightboxContent();
}

// Event Listeners
closeBtn?.addEventListener('click', closeLightbox);
nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

lightbox?.addEventListener('click', (e) => {
    if (e.target === lightbox) {
        closeLightbox();
    }
});

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('visible')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
});

// ===== Mobile Swipe Support =====
let touchStartX = 0;
let touchEndX = 0;

lightbox?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
}, { passive: true });

lightbox?.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, { passive: true });

function handleSwipe() {
    const swipeThreshold = 50; // Minimum distance for a swipe
    const difference = touchStartX - touchEndX;

    if (Math.abs(difference) > swipeThreshold) {
        if (difference > 0) {
            // Swiped Left -> Next Image
            showNext();
        } else {
            // Swiped Right -> Previous Image
            showPrev();
        }
    }
}


// ===== Daily Menu Google Sheets Integration =====

// CONFIGURATION - Update these values with your Google Sheets information
const DAILY_MENU_CONFIG = {
    // Option 1: Public Google Sheets (Recommended for simplicity)
    // Replace SHEET_ID with your actual Google Sheets ID
    // Example: https://docs.google.com/spreadsheets/d/1ABC123xyz/edit
    // The SHEET_ID is: 1ABC123xyz
    sheetId: 'YOUR_SHEET_ID_HERE',
    sheetName: 'Sheet1', // Name of the sheet tab

    // Option 2: Google Sheets API (Uncomment and configure if using API)
    // apiKey: 'YOUR_API_KEY_HERE',
    // range: 'Sheet1!A2:F8', // Adjust range as needed

    // Cache settings
    cacheKey: 'dailyMenu_cache',
    cacheDuration: 4 * 60 * 60 * 1000, // 4 hours in milliseconds

    // Timeout for API calls
    fetchTimeout: 10000 // 10 seconds
};

// Czech day names
const CZECH_DAYS = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

// Initialize Daily Menu on page load
document.addEventListener('DOMContentLoaded', () => {
    initDailyMenu();
});

async function initDailyMenu() {
    const loader = document.getElementById('menuLoader');
    const error = document.getElementById('menuError');
    const content = document.getElementById('menuContent');

    // Check if configuration is set
    if (DAILY_MENU_CONFIG.sheetId === 'YOUR_SHEET_ID_HERE') {
        showConfigurationMessage();
        return;
    }

    // Try to load from cache first
    const cachedData = getCachedMenu();
    if (cachedData) {
        console.log('Loading menu from cache');
        renderDailyMenu(cachedData);
        loader.style.display = 'none';
        content.style.display = 'grid';

        // Fetch fresh data in background
        fetchDailyMenu(true);
        return;
    }

    // Fetch fresh data
    await fetchDailyMenu(false);
}

async function fetchDailyMenu(isBackgroundUpdate = false) {
    const loader = document.getElementById('menuLoader');
    const error = document.getElementById('menuError');
    const content = document.getElementById('menuContent');

    if (!isBackgroundUpdate) {
        loader.style.display = 'flex';
        error.style.display = 'none';
        content.style.display = 'none';
    }

    try {
        // Construct the URL for public Google Sheets
        const url = `https://docs.google.com/spreadsheets/d/${DAILY_MENU_CONFIG.sheetId}/gviz/tq?tqx=out:json&sheet=${DAILY_MENU_CONFIG.sheetName}`;

        // Fetch with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DAILY_MENU_CONFIG.fetchTimeout);

        const response = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const text = await response.text();

        // Parse Google Sheets JSON response (it's wrapped in a function call)
        const jsonString = text.substring(47).slice(0, -2);
        const data = JSON.parse(jsonString);

        // Parse the data
        const menuData = parseGoogleSheetsData(data);

        if (menuData.length === 0) {
            showNoMenuMessage();
            return;
        }

        // Cache the data
        setCachedMenu(menuData);

        // Render the menu
        renderDailyMenu(menuData);

        loader.style.display = 'none';
        error.style.display = 'none';
        content.style.display = 'grid';

        console.log('Daily menu loaded successfully');

    } catch (err) {
        console.error('Error fetching daily menu:', err);

        if (!isBackgroundUpdate) {
            loader.style.display = 'none';
            error.style.display = 'flex';

            const errorMessage = document.getElementById('errorMessage');
            if (err.name === 'AbortError') {
                errorMessage.textContent = 'Načítání menu trvá příliš dlouho. Zkuste to prosím později.';
            } else {
                errorMessage.textContent = 'Nepodařilo se načíst menu. Zkuste to prosím později.';
            }
        }
    }
}

function parseGoogleSheetsData(data) {
    const menuData = [];

    try {
        const rows = data.table.rows;

        // Expected columns: Day | Soup | Main Dish 1 | Main Dish 2 | Price | Allergens
        // Adjust this parsing based on your actual sheet structure

        rows.forEach(row => {
            if (!row.c || !row.c[0]) return; // Skip empty rows

            const day = row.c[0]?.v || '';
            const soup = row.c[1]?.v || '';
            const mainDish1 = row.c[2]?.v || '';
            const mainDish2 = row.c[3]?.v || '';
            const price = row.c[4]?.v || '';
            const allergens = row.c[5]?.v || '';

            if (day) {
                menuData.push({
                    day: day,
                    soup: soup,
                    mainDish1: mainDish1,
                    mainDish2: mainDish2,
                    price: price,
                    allergens: allergens
                });
            }
        });

    } catch (err) {
        console.error('Error parsing menu data:', err);
    }

    return menuData;
}

function renderDailyMenu(menuData) {
    const content = document.getElementById('menuContent');
    content.innerHTML = '';

    const today = new Date().getDay();
    const todayName = CZECH_DAYS[today];

    menuData.forEach(item => {
        const card = document.createElement('div');
        card.className = 'daily-menu-card';

        // Check if this is today's menu
        if (item.day.toLowerCase() === todayName.toLowerCase()) {
            card.classList.add('today');
        }

        // Build the card HTML
        let cardHTML = `
            <div class="menu-card-header">
                <div class="menu-day">${item.day}</div>
            </div>
            <div class="menu-card-content">
        `;

        // Add soup if available
        if (item.soup) {
            cardHTML += `
                <div class="menu-course">
                    <div class="course-label">Polévka</div>
                    <div class="course-name">${item.soup}</div>
                </div>
            `;
        }

        // Add main dishes
        if (item.mainDish1) {
            cardHTML += `
                <div class="menu-course">
                    <div class="course-label">Hlavní jídlo</div>
                    <div class="course-name">${item.mainDish1}</div>
                </div>
            `;
        }

        if (item.mainDish2) {
            cardHTML += `
                <div class="menu-course">
                    <div class="course-label">Alternativa</div>
                    <div class="course-name">${item.mainDish2}</div>
                </div>
            `;
        }

        cardHTML += `</div>`; // Close menu-card-content

        // Add footer with price and allergens
        if (item.price || item.allergens) {
            cardHTML += `<div class="menu-card-footer">`;

            if (item.price) {
                cardHTML += `
                    <div>
                        <div class="price-label">Cena</div>
                        <div class="menu-price">${item.price}</div>
                    </div>
                `;
            }

            if (item.allergens) {
                cardHTML += `
                    <div class="course-allergens">
                        Alergeny: ${item.allergens}
                    </div>
                `;
            }

            cardHTML += `</div>`; // Close menu-card-footer
        }

        card.innerHTML = cardHTML;
        content.appendChild(card);
    });
}

function showNoMenuMessage() {
    const loader = document.getElementById('menuLoader');
    const error = document.getElementById('menuError');
    const content = document.getElementById('menuContent');

    loader.style.display = 'none';
    error.style.display = 'none';
    content.style.display = 'block';

    content.innerHTML = `
        <div class="no-menu-message">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            <h3>Dnes není menu k dispozici</h3>
            <p>Omlouváme se, denní menu momentálně není dostupné. Podívejte se prosím na naše stálé menu níže.</p>
        </div>
    `;
}

function showConfigurationMessage() {
    const loader = document.getElementById('menuLoader');
    const error = document.getElementById('menuError');
    const content = document.getElementById('menuContent');

    loader.style.display = 'none';
    error.style.display = 'flex';
    content.style.display = 'none';

    const errorMessage = document.getElementById('errorMessage');
    errorMessage.innerHTML = `
        <strong>Konfigurace Google Sheets chybí</strong><br>
        Prosím, nastavte SHEET_ID v souboru script.js (řádek ~336).<br>
        <small>Viz dokumentace v kódu pro více informací.</small>
    `;
}

// Cache Management
function getCachedMenu() {
    try {
        const cached = localStorage.getItem(DAILY_MENU_CONFIG.cacheKey);
        if (!cached) return null;

        const { data, timestamp } = JSON.parse(cached);
        const now = Date.now();

        // Check if cache is still valid
        if (now - timestamp < DAILY_MENU_CONFIG.cacheDuration) {
            return data;
        }

        // Cache expired
        localStorage.removeItem(DAILY_MENU_CONFIG.cacheKey);
        return null;

    } catch (err) {
        console.error('Error reading cache:', err);
        return null;
    }
}

function setCachedMenu(data) {
    try {
        const cacheData = {
            data: data,
            timestamp: Date.now()
        };
        localStorage.setItem(DAILY_MENU_CONFIG.cacheKey, JSON.stringify(cacheData));
    } catch (err) {
        console.error('Error setting cache:', err);
    }
}

