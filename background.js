// Function to get current IP via ipify
async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error(`Error: API returned status ${response.status}`);
        }
        const data = await response.json();
        console.log("IP received:", data.ip);
        return data.ip;
    } catch (error) {
        console.error("Error while getting IP:", error.message);
        throw new Error("Failed to get IP. Check your internet connection.");
    }
}

// Function to get country information via ipapi.co
async function getCountryFromIp(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!response.ok) {
            throw new Error(`Error: ipapi.co API returned status ${response.status}`);
        }
        const data = await response.json();
        console.log("IP information:", data);
        return data.country_code;
    } catch (error) {
        console.error("Error while getting country information:", error.message);
        throw new Error("Failed to get country information.");
    }
}

// Function to update flag icon
async function updateFlagIcon(tabId) {
    try {
        // Check if the extension is enabled
        const { isEnabled } = await browser.storage.local.get('isEnabled');

        if (isEnabled === false) {
            // If disabled, hide the icon
            browser.pageAction.hide(tabId);
            return;
        }

        // Get IP address
        const ip = await getIpAddress();

        // Get country by IP
        const country = await getCountryFromIp(ip);
        const iconUrl = `https://flagcdn.com/48x36/${country.toLowerCase()}.png`;

        // Set flag icon in URL bar
        browser.pageAction.setIcon({ tabId: tabId, path: iconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: `IP: ${ip}` });
        browser.pageAction.show(tabId);  // Show the icon
    } catch (error) {
        console.error("Error updating flag:", error.message);

        // Set error icon
        const errorIconUrl = "icons/error-48.png";
        browser.pageAction.setIcon({ tabId: tabId, path: errorIconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: "Error getting IP" });
        browser.pageAction.show(tabId);  // Show error icon
    }
}

// Handler for tab switching
browser.tabs.onActivated.addListener(async (activeInfo) => {
    updateFlagIcon(activeInfo.tabId);
});

// Handler for page update
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateFlagIcon(tabId);
    }
});

// Initialize icon when extension starts
browser.tabs.query({}).then(tabs => {
    for (let tab of tabs) {
        updateFlagIcon(tab.id);
    }
});
