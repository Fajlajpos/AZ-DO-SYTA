/**
 * Cookie Consent Manager
 * Handles GDPR compliance for Czech Republic (Opt-in principle)
 */

document.addEventListener('DOMContentLoaded', () => {
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptBtn = document.getElementById('cookie-accept');
    const necessaryBtn = document.getElementById('cookie-necessary');

    // Check if user has already made a choice
    if (!localStorage.getItem('cookie_consent')) {
        // Show banner with a slight delay for better UX
        setTimeout(() => {
            cookieBanner.classList.add('visible');
        }, 1000);
    } else {
        // If consent was already given 'all', we can enable analytics immediately
        if (localStorage.getItem('cookie_consent') === 'all') {
            enableAnalytics();
        }
    }

    // "Accept All" Action
    acceptBtn?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'all');
        cookieBanner.classList.remove('visible');
        enableAnalytics();
    });

    // "Necessary Only" Action
    necessaryBtn?.addEventListener('click', () => {
        localStorage.setItem('cookie_consent', 'necessary');
        cookieBanner.classList.remove('visible');
        // Do NOT enable analytics
    });
});

/**
 * Enable marketing/analytics scripts
 * This function is only called if user accepts all cookies
 */
function enableAnalytics() {
    console.log('Cookies: Analytics enabled');
    // Here you would insert Google Analytics, Facebook Pixel, etc.
    // Example:
    // window.dataLayer = window.dataLayer || [];
    // function gtag(){dataLayer.push(arguments);}
    // gtag('js', new Date());
    // gtag('config', 'UA-XXXXX-Y');
}
