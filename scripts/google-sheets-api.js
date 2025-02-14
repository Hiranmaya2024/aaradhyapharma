//google-sheets-api.js

// Use configuration from config.js (config object is loaded from config.js script)
const BASE_URL = `https://sheets.googleapis.com/v4/spreadsheets/${config.SHEET_ID}/values`;

// Make functions available globally
window.getLoginCredentials = async function() {
    return await fetchSheetData('Login!A2:C');
};

window.getStockData = async function() {
    return await fetchSheetData('Stock!A2:F');
};
window.getStocksData = async function() {
    return await fetchSheetData('Stocks!A2:G');
}

window.getCustomerLedger = async function() {
    return await fetchSheetData('CustomerLedger!A2:O');
};
window.getLedger = async function() {
    return await fetchSheetData('Ledger!A2:M');
};

window.getOffers = async function() {
    return await fetchSheetData('Offers!A2:A');
};
// Add a new function to fetch customer photos
window.getCustomerPhotos = async function() {
    return await fetchSheetData('CustomerPhotos!A2:C'); // Adjust the range as needed
};
// Function to get API key from config
function getApiKey() {
    if (!config.API_KEY) {
        throw new Error('API key not configured. Please set it in config.js');
    }
    return config.API_KEY;
}

// Fetch data from a specific sheet range
async function fetchSheetData(range) {
    const API_KEY = getApiKey();
    const url = `${BASE_URL}/${range}?key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data: ${response.statusText}`);
        }
        const data = await response.json();
        return data.values || [];
    } catch (error) {
        console.error('Error fetching sheet data:', error);
        throw error;
    }
}
