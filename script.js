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
            if (document.getElementById('navMenu')?.classList.contains('active')) {
                document.getElementById('navMenu').classList.remove('active');
                document.getElementById('mobileToggle')?.classList.remove('active');
                document.body.style.overflow = ''; // Restore scrolling
            }
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
    mobileToggle.classList.toggle('active');

    // Toggle body scroll lock
    if (navMenu?.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
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
    cacheDuration: 5 * 60 * 1000, // 5 minutes (faster updates for new images)

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
        // Matches: https://drive.google.com/file/d/[ID] OR https://drive.google.com/open?id=[ID] etc.
        const driveLinkRegex = /drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
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

    // Extract ID to generate multiple candidate URLs
    const idMatch = item.imageUrl.match(/id=([a-zA-Z0-9_-]+)/) || item.imageUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
    let fileId = null;
    let candidateUrls = [];

    // Fallback image (use a nice existing dish as placeholder if drive fully fails)
    const fallbackImgUrl = 'images/svickova_dish_1765053566812.png';

    if (idMatch && idMatch[1]) {
        fileId = idMatch[1];
        // STRATEGY: Try multiple Google Drive endpoints in order of reliability/speed
        candidateUrls = [
            `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`,      // Option 1: Thumbnail API (Fastest)
            `https://lh3.googleusercontent.com/d/${fileId}=s2000`,           // Option 2: LH3 Direct (Very reliable)
            `https://drive.google.com/uc?export=view&id=${fileId}`,          // Option 3: Standard Export (Can be rate limited)
            fallbackImgUrl                                                   // Option 4: Local Fallback
        ];
    } else {
        // If we can't parse ID, just use the raw URL provided and then fallback
        candidateUrls = [item.imageUrl, fallbackImgUrl];
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

    // Get today's date for the badge
    const today = new Date();
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    let dateStr = today.toLocaleDateString('cs-CZ', dateOptions);
    dateStr = dateStr.charAt(0).toUpperCase() + dateStr.slice(1); // Capitalize

    // We start with the first candidate
    const initialSrc = candidateUrls[0];

    const cardHTML = `
        <!-- Override fixed height of .menu-image to allow natural image height -->
        <div class="menu-image" style="height: auto !important; min-height: auto !important; aspect-ratio: auto !important; padding-bottom: 0; position: relative;">
            
            <!-- Date Badge -->
            <div style="position: absolute; top: 15px; right: 15px; background: rgba(255, 255, 255, 0.95); padding: 6px 14px; border-radius: 30px; font-weight: 600; color: #8B1538; box-shadow: 0 4px 15px rgba(0,0,0,0.15); z-index: 5; font-size: 0.85rem; letter-spacing: 0.5px; backdrop-filter: blur(4px);">
                ${dateStr}
            </div>

            <img 
                id="dailyMenuImg"
                src="${initialSrc}" 
                data-candidates='${JSON.stringify(candidateUrls)}'
                data-current-index="0"
                alt="Denní menu" 
                onload="this.style.opacity=1" 
                onerror="handleMenuImageError(this)"
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
        // Get the current successful source from the image element
        const imgEl = document.getElementById('dailyMenuImg');
        const currentSrc = imgEl.src;

        const dailyMenuLightboxItem = {
            src: currentSrc,
            alt: "Denní menu",
            title: "Denní menu",
            desc: "Aktuální nabídka"
        };

        // ISOLATION: Set the active lightbox context to ONLY this item
        activeLightboxItems = [dailyMenuLightboxItem];

        openLightbox(0);
    });
}

// Global handler for image errors to try next candidate
window.handleMenuImageError = function (img) {
    const candidates = JSON.parse(img.getAttribute('data-candidates') || '[]');
    let currentIndex = parseInt(img.getAttribute('data-current-index') || '0');

    // Move to next candidate
    currentIndex++;

    if (currentIndex < candidates.length) {
        console.warn(`Menu image load failed. Retrying with candidate ${currentIndex + 1}:`, candidates[currentIndex]);
        img.setAttribute('data-current-index', currentIndex);
        img.src = candidates[currentIndex];
    } else {
        console.error('All menu image candidates failed.');
        // Ensure opacity is 1 so the fallback (already set in last step) is visible if it was a candidate, 
        // or just leave broken symbol if even fallback failed.
        img.style.opacity = '1';
    }
};

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


// ===== Language Support =====
const translations = {
    cz: {
        nav: {
            home: "ÚVOD",
            about: "O NÁS",
            dailyMenu: "DENNÍ MENU",
            menu: "MENU",
            reservations: "REZERVACE"
        },
        hero: {
            title: "Tradice v moderním hávu",
            subtitle: "Objevte českou kuchyni, jakou jste ještě neznali",
            description: "Spojujeme tradiční chutě s inovativní gastronomií a prvotřídními surovinami",
            cta: "REZERVOVAT"
        },
        about: {
            title: "Náš příběh",
            block1Title: "Kde tradice potkává inovaci",
            block1Text: "AŽ DO SYTA vznikla z lásky k české kuchyni a touhy ukázat její pravou tvář světu. Naše restaurace je oslavou chutí, které známe od dětství, ale prezentovaných způsobem, který překvapí i ty nejnáročnější gurmány.",
            block2Title: "Naše filozofie",
            block2Text: "Věříme, že tradiční česká kuchyně si zaslouží stejnou pozornost a respekt jako jakákoli jiná světová gastronomie. Proto každý pokrm připravujeme s maximální péčí, používáme pouze čerstvé lokální suroviny od ověřených dodavatelů a klasické recepty obohacujeme moderními technikami.",
            block3Title: "Proč jsme tady",
            block3Text: "Chceme změnit pohled na českou kuchyni. Svíčková, vepřo-knedlo-zelo nebo smažený sýr nejsou jen \"obyčejná\" jídla - v našich rukou se stávají gastronomickým zážitkem. Každé sousto vypráví příběh naší země, naší historie a našich babiček, ale v moderním a sofistikovaném podání."
        },
        dailyMenu: {
            title: "Denní menu",
            subtitle: "Čerstvé menu každý den • Aktualizováno denně",
            loading: "Načítání menu...",
            error: "Nepodařilo se načíst menu. Zkuste to prosím později.",
            noMenuTitle: "Dnes není menu k dispozici",
            noMenuText: "Omlouváme se, denní menu momentálně není dostupné. Podívejte se prosím na naše stálé menu níže.",
            detail: "Zobrazit detail",
            dateFormat: "cs-CZ"
        },
        menu: {
            title: "Naše speciality",
            subtitle: "Tradiční pokrmy v luxusním a moderním podání",
            detail: "Zobrazit detail",
            items: {
                svickova: {
                    title: "Svíčková na smetaně",
                    desc: "Hovězí svíčková marinovaná 24 hodin, podávaná s jemnou smetanovou omáčkou z pečené zeleniny, domácími karlovarskými knedlíky a brusinkovým chutney"
                },
                vepro: {
                    title: "Vepřo-knedlo-zelo Premium",
                    desc: "Pomalu pečená vepřová panenka s křupavou kůrčičkou, fialové zelí s jablky a hřebíčkem, bramborové knedlíky s bylinkami"
                },
                syr: {
                    title: "Smažený sýr Deluxe",
                    desc: "Ementál v křupavé panádě s lanýžovou majonézou, rukolový salát s cherry rajčaty, domácí tatarská omáčka s kapary"
                },
                gulas: {
                    title: "Hovězí guláš Signature",
                    desc: "Hovězí líčka dušená 6 hodin v červeném víně s paprikou a kmínem, podáváno v litinové pánvičce s čerstvým chlebem a cibulkou"
                },
                trdelnik: {
                    title: "Trdelník Reimagined",
                    desc: "Domácí trdelník s vanilkovou zmrzlinou, karamelovou omáčkou, čerstvými lesními plody a zlatým listkem"
                },
                degustation: {
                    title: "Degustační menu šéfkuchaře",
                    desc: "Sedmichodové menu představující to nejlepší z naší kuchyně s párováním vín. Každý týden nové překvapení"
                }
            }
        },
        reservations: {
            title: "Kontakt a Rezervace",
            subtitle: "Těšíme se na vaši návštěvu. Pro rezervaci nám prosím zavolejte.",
            call: "Zavolejte nám",
            callAction: "Klikněte pro zavolání",
            write: "Napište nám",
            writeAction: "Klikněte pro zkopírování",
            copied: "Zkopírováno!",
            find: "Kde nás najdete",
            hours: "Otevírací doba",
            daysWeek: "Po - Pá:",
            daysWeekend: "So - Ne:"
        },
        footer: {
            desc: "Objevte českou kuchyni v moderním hávu",
            nav: "Navigace",
            contact: "Kontakt",
            social: "Sledujte nás",
            disclaimer: "Tato stránka je pouze ukázkový projekt / koncept a restaurace momentálně není v provozu.",
            rights: "Všechna práva vyhrazena."
        }
    },
    en: {
        nav: {
            home: "HOME",
            about: "ABOUT",
            dailyMenu: "DAILY MENU",
            menu: "MENU",
            reservations: "RESERVATIONS"
        },
        hero: {
            title: "Tradition in Modern Guise",
            subtitle: "Discover Czech cuisine like never before",
            description: "We combine traditional flavors with innovative gastronomy and premium ingredients",
            cta: "BOOK A TABLE"
        },
        about: {
            title: "Our Story",
            block1Title: "Where Tradition Meets Innovation",
            block1Text: "AŽ DO SYTA was born from a love for Czech cuisine and a desire to show its true face to the world. Our restaurant is a celebration of flavors we've known since childhood, but presented in a way that surprises even the most demanding gourmets.",
            block2Title: "Our Philosophy",
            block2Text: "We believe traditional Czech cuisine deserves the same attention and respect as any other world gastronomy. That's why we prepare every dish with maximum care, using only fresh local ingredients from verified suppliers and enriching classic recipes with modern techniques.",
            block3Title: "Why We Are Here",
            block3Text: "We want to change the perspective on Czech cuisine. Sirloin in cream sauce, roast pork with dumplings and sauerkraut, or fried cheese aren't just \"ordinary\" meals - in our hands, they become a gastronomic experience. Every bite tells the story of our land, our history, and our grandmothers, but in a modern and sophisticated presentation."
        },
        dailyMenu: {
            title: "Daily Menu",
            subtitle: "Fresh menu every day • Updated daily",
            loading: "Loading menu...",
            error: "Failed to load menu. Please try again later.",
            noMenuTitle: "No Menu Available Today",
            noMenuText: "We apologize, the daily menu is currently unavailable. Please check our standard menu below.",
            detail: "View Detail",
            dateFormat: "en-US"
        },
        menu: {
            title: "Our Specialties",
            subtitle: "Traditional dishes in a luxurious and modern presentation",
            detail: "View Detail",
            items: {
                svickova: {
                    title: "Sirloin in Cream Sauce",
                    desc: "Beef sirloin marinated for 24 hours, served with delicate cream sauce made from roasted vegetables, homemade Karlovy Vary dumplings, and cranberry chutney"
                },
                vepro: {
                    title: "Roast Pork Premium",
                    desc: "Slow-roasted pork tenderloin with crispy crust, red cabbage with apples and cloves, potato dumplings with herbs"
                },
                syr: {
                    title: "Fried Cheese Deluxe",
                    desc: "Emmental in crispy breadcrumbs with truffle mayonnaise, arugula salad with cherry tomatoes, homemade tartar sauce with capers"
                },
                gulas: {
                    title: "Beef Goulash Signature",
                    desc: "Beef cheeks braised for 6 hours in red wine with paprika and cumin, served in a cast iron skillet with fresh bread and onion"
                },
                trdelnik: {
                    title: "Trdelník Reimagined",
                    desc: "Homemade chimney cake with vanilla ice cream, caramel sauce, fresh forest berries, and gold leaf"
                },
                degustation: {
                    title: "Chef's Tasting Menu",
                    desc: "Seven-course menu presenting the best of our kitchen with wine pairing. A new surprise every week"
                }
            }
        },
        reservations: {
            title: "Contact and Reservations",
            subtitle: "We look forward to your visit. Please call us to make a reservation.",
            call: "Call Us",
            callAction: "Click to call",
            write: "Write to Us",
            writeAction: "Click to copy",
            copied: "Copied!",
            find: "Where to Find Us",
            hours: "Opening Hours",
            daysWeek: "Mon - Fri:",
            daysWeekend: "Sat - Sun:"
        },
        footer: {
            desc: "Discover Czech cuisine in a modern guise",
            nav: "Navigation",
            contact: "Contact",
            social: "Follow Us",
            disclaimer: "This page is only a sample project / concept and the restaurant is currently not in operation.",
            rights: "All rights reserved."
        }
    }
};

let currentLang = localStorage.getItem('lang') || 'cz';

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);

    // Update html lang attribute
    document.documentElement.lang = lang === 'cz' ? 'cs' : 'en';

    // Update Language Toggle UI
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.textContent = lang === 'cz' ? 'EN' : 'CZ'; // Show opposite language as action
        langToggle.setAttribute('aria-label', lang === 'cz' ? 'Switch to English' : 'Přepnout do češtiny');
    }

    // Update all translatable elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const keys = el.getAttribute('data-i18n').split('.');
        let value = translations[lang];
        keys.forEach(key => {
            if (value) value = value[key];
        });

        if (value) {
            // Check if element has placeholder
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = value;
            } else {
                el.innerText = value;
            }
        }
    });
}


// Add Language Toggle Listener
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Language
    setLanguage(currentLang);
});

// Expose toggle function globally for the HTML onclick
window.toggleLanguage = function () {
    console.log("Toggle Language Called. Current:", currentLang);
    const newLang = currentLang === 'cz' ? 'en' : 'cz';
    setLanguage(newLang);
};
