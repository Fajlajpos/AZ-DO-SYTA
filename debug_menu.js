
const fetch = require('node-fetch'); // Assuming node-fetch is available or using built-in in newer node
// If node-fetch is not available, we might need a different approach, but let's try.

const URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTOYORXSKVnrDF9GbufZx5hegRqN9WxdsjyCltAVjm6GLZ1wOV6IqYiHSR1PwSrUCcZz91zswKo4P8c/pub?gid=0&single=true&output=csv';
const PROXY_URL = 'https://corsproxy.io/?' + encodeURIComponent(URL);

async function testFetch() {
    console.log('Testing Direct Fetch...');
    try {
        const res = await fetch(URL);
        console.log('Direct Fetch Status:', res.status);
        const text = await res.text();
        console.log('Direct Fetch Length:', text.length);
        console.log('Direct Fetch Preview:', text.substring(0, 100));
    } catch (e) {
        console.log('Direct Fetch Failed:', e.message);
    }

    console.log('\nTesting Proxy Fetch...');
    try {
        const res = await fetch(PROXY_URL);
        console.log('Proxy Fetch Status:', res.status);
        const text = await res.text();
        console.log('Proxy Fetch Length:', text.length);
        console.log('Proxy Fetch Preview:', text.substring(0, 100));
    } catch (e) {
        console.log('Proxy Fetch Failed:', e.message);
    }
}

testFetch();
