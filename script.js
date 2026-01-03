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

let mainMenuItemsData = []; // Stores the standard menu items
let activeLightboxItems = []; // Stores the currently active set (either main menu or daily menu)
let currentImageIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');

    menuItems.forEach((item, index) => {
        const img = item.querySelector('img');
        const title = item.querySelector('.menu-info h3').innerText;
        const desc = item.querySelector('.menu-info p').innerText;

        mainMenuItemsData.push({
            src: img.src,
            alt: img.alt,
            title: title,
            desc: desc
        });

        // Add click listener to the image container
        const imageContainer = item.querySelector('.menu-image');
        imageContainer.addEventListener('click', () => {
            // Set context to Main Menu
            activeLightboxItems = mainMenuItemsData;
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
    // Safety check
    if (!activeLightboxItems || activeLightboxItems.length === 0) return;

    const data = activeLightboxItems[currentImageIndex];
    lightboxImage.src = data.src;
    lightboxImage.alt = data.alt;
    lightboxTitle.innerText = data.title;
    lightboxDesc.innerText = data.desc;

    // Toggle navigation arrows based on item count in CURRENT active set
    if (activeLightboxItems.length <= 1) {
        if (prevBtn) prevBtn.style.display = 'none';
        if (nextBtn) nextBtn.style.display = 'none';
    } else {
        if (prevBtn) prevBtn.style.display = 'block';
        if (nextBtn) nextBtn.style.display = 'block';
    }
}

function showNext() {
    if (!activeLightboxItems.length) return;
    currentImageIndex = (currentImageIndex + 1) % activeLightboxItems.length;
    updateLightboxContent();
}

function showPrev() {
    if (!activeLightboxItems.length) return;
    currentImageIndex = (currentImageIndex - 1 + activeLightboxItems.length) % activeLightboxItems.length;
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


// CONFIGURATION - Google Sheets CSV Integration
const DAILY_MENU_CONFIG = {
    // CSV URL from Google Sheets (File > Share > Publish to web > CSV)
    csvUrl: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOYORXSKVnrDF9GbufZx5hegRqN9WxdsjyCltAVjm6GLZ1wOV6IqYiHSR1PwSrUCcZz91zswKo4P8c/pub?gid=0&single=true&output=csv',

    // Use demo data if CSV fails (set to false once your sheet is working)
    useDemoData: false,

    // Cache settings
    cacheKey: 'dailyMenu_cache_v2', // Changed key to force refresh
    cacheDuration: 1 * 60 * 60 * 1000, // 1 hour (more frequent updates for image)

    // Timeout for API calls
    fetchTimeout: 10000 // 10 seconds
};

// Demo data for testing (will be used if useDemoData is true or CSV fails)
// Demo data for testing (will be used if useDemoData is true or CSV fails)
const DEMO_MENU_DATA = [];

// Czech day names
const CZECH_DAYS = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];

// Initialize Daily Menu on page load
document.addEventListener('DOMContentLoaded', () => {
    initDailyMenu();
});

const DEFAULT_MENU_IMAGE = 'https://drive.google.com/uc?export=view&id=11qWXcAjxPkHNtBFa1Yqy-ZAqymnlXT-Q';

async function initDailyMenu() {
    const loader = document.getElementById('menuLoader');
    const content = document.getElementById('menuContent');

    // OPTIMISTIC UI: Render default menu immediately
    // This guarantees the user sees the menu instantly without errors
    if (content) {
        console.log('Rendering optimistic default menu...');
        renderDailyMenu([{ imageUrl: DEFAULT_MENU_IMAGE }]);

        if (loader) loader.style.display = 'none';
        content.style.display = 'grid';
    }

    // Still try to fetch fresh data in background to update if changed
    await fetchDailyMenu(true);
}

async function fetchDailyMenu(isBackgroundUpdate = false) {
    // Note: Loader is skipped because we use Optimistic UI in initDailyMenu


    try {
        // Fetch CSV data
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), DAILY_MENU_CONFIG.fetchTimeout);

        let csvText = null;

        try {
            // Attempt 1: Direct fetch (works if CORS is enabled on Sheet)
            const response = await fetch(DAILY_MENU_CONFIG.csvUrl, { signal: controller.signal });
            if (response.ok) {
                csvText = await response.text();
            } else {
                throw new Error('Direct fetch failed');
            }
        } catch (directError) {
            console.warn('Direct fetch failed, trying proxy...', directError);

            try {
                // Attempt 2: CORS Proxy (corsproxy.io is often more reliable for raw data)
                const proxyUrl = `https://corsproxy.io/?` + encodeURIComponent(DAILY_MENU_CONFIG.csvUrl);
                const response = await fetch(proxyUrl, { signal: controller.signal });
                if (response.ok) {
                    csvText = await response.text();
                } else {
                    throw new Error('Proxy fetch failed');
                }
            } catch (proxyError) {
                console.warn('Proxy fetch failed:', proxyError);
            }
        }

        clearTimeout(timeoutId);

        // Fallback: Use hardcoded latest known ID if all fetches fail
        // This ensures the site works NOW, even if dynamic fetching is flaky
        if (!csvText || (!csvText.includes('drive.google.com') && !csvText.includes('driveusercontent'))) {
            console.warn('All fetches failed or returned invalid data. Using fallback.');
            // This ID was retrieved during analysis and is likely the current menu
            csvText = 'https://drive.google.com/file/d/11qWXcAjxPkHNtBFa1Yqy-ZAqymnlXT-Q/view?usp=sharing';
        }

        console.log('✅ CSV/Fallback loaded, length:', csvText.length);

        // Parse CSV data
        const menuData = parseCSVData(csvText);
        console.log('🔍 Parsed menu data:', menuData);

        if (menuData.length === 0) {
            console.warn('No menu data found after parsing');
            showNoMenuMessage();
            return;
        }

        // Cache the data
        setCachedMenu(menuData);

        if (menuData.length === 0) {
            console.warn('No menu data found after parsing');
            return;
        }

        // Cache the data
        setCachedMenu(menuData);

        // Render the menu
        renderDailyMenu(menuData);
        console.log('Daily menu loaded successfully', menuData);

    } catch (err) {
        console.error('Error in background update:', err);
        // We do NOT show an error message because we already have the optimistic default shown.
    }
}

function parseCSVData(csvText) {
    const menuData = [];

    try {
        // Look for Google Drive link in the text
        // Matches: https://drive.google.com/file/d/[ID]/view...
        const driveLinkRegex = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const match = csvText.match(driveLinkRegex);

        if (match && match[1]) {
            const fileId = match[1];
            // Convert to direct view link
            const directLink = `https://drive.google.com/uc?export=view&id=${fileId}`;

            menuData.push({
                imageUrl: directLink,
                originalUrl: match[0]
            });
        }

    } catch (err) {
        console.error('Error parsing menu data:', err);
    }

    return menuData;
}

function renderDailyMenu(menuData) {
    const content = document.getElementById('menuContent');
    content.innerHTML = '';
    // Center the item
    content.style.display = 'flex';
    content.style.justifyContent = 'center';

    if (!menuData || menuData.length === 0 || !menuData[0].imageUrl) {
        showNoMenuMessage();
        return;
    }

    const item = menuData[0];

    // Attempt direct image link
    let directImgUrl = item.imageUrl;
    // Extract ID
    const idMatch = item.imageUrl.match(/id=([a-zA-Z0-9_-]+)/) || item.imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    let fileId = null;

    // Fallback image (use a nice existing dish as placeholder if drive fails)
    const fallbackImgUrl = 'images/svickova_dish_1765053566812.png';

    if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
        // STRATEGY: Use the thumbnail endpoint with large size (sz=w2000) as primary.
        directImgUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`;
    }

    // Create the container with .menu-item class to inherit all standard styles
    // We add a specific style (max-width) to keep it reasonable for a single item
    const card = document.createElement('div');
    card.className = 'menu-item';

    // Allow width to fit content up to a max, but let height be natural
    card.style.maxWidth = '380px';
    card.style.width = '100%';
    card.style.margin = '0'; // Flexbox handles centering

    // FORCE VISIBILITY: Overwrite any potential reveal animation styles
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    card.style.display = 'block';

    // ALLOW NATURAL HEIGHT:
    // We override the fixed height from style.css `.menu-image` (which is often 200px or 250px) 
    // to allow the daily menu image to grow naturally based on its aspect ratio.

    // Get today's date for the badge
    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let dateStr = today.toLocaleDateString('cs-CZ', dateOptions);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1); // Capitalize

    const cardHTML = `
        <!-- Override fixed height of .menu-image to allow natural image height -->
        <div class="menu-image" style="height: auto !important; min-height: auto !important; aspect-ratio: auto !important; padding-bottom: 0; position: relative;">
            
            <!-- Date Badge -->
            <div style="position: absolute; top: 15px; right: 15px; background: rgba(255, 255, 255, 0.95); padding: 6px 14px; border-radius: 30px; font-weight: 600; color: #8B1538; box-shadow: 0 4px 15px rgba(0,0,0,0.15); z-index: 5; font-size: 0.85rem; letter-spacing: 0.5px; backdrop-filter: blur(4px);">
                ${dateStr}
            </div>

            <img 
                src="${directImgUrl}" 
                alt="Denní menu" 
                onload="this.style.opacity=1" 
                onerror="this.onerror=null; this.src='${fallbackImgUrl}';"
                style="width: 100%; height: auto; display: block; object-fit: contain; min-height: 200px; background: #f0f0f0;"
            >
            <div class="menu-overlay">
                <span class="view-detail">Zobrazit detail</span>
            </div>
        </div>
        <!-- We omit the text section intentionally as the daily menu information is inside the image -->
    `;

    card.innerHTML = cardHTML;
    content.appendChild(card);

    // Add Lightbox Click Event - EXACTLY matching standard behavior but ISOLATED
    const menuImageDiv = card.querySelector('.menu-image');
    menuImageDiv.addEventListener('click', () => {
        // Get the ACTUAL currently displayed source (handling fallback)
        const currentSrc = menuImageDiv.querySelector('img').src;

        let lightboxSrc = currentSrc;
        if (fileId && currentSrc.includes(fileId)) {
            lightboxSrc = directImgUrl;
        }

        const dailyMenuLightboxItem = {
            src: lightboxSrc,
            alt: "Denní menu",
            title: "Denní menu",
            desc: "Aktuální nabídka"
        };

        // ISOLATION: Set the active lightbox context to ONLY this item
        // This ensures no navigation arrows appear and Main Menu data is preserved
        activeLightboxItems = [dailyMenuLightboxItem];

        openLightbox(0);
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

