document.addEventListener('DOMContentLoaded', async () => {
    const ipElement = document.getElementById('ip');
    const locationElement = document.getElementById('location');
    const regionElement = document.getElementById('region');
    const cityElement = document.getElementById('city');
    const currentTimeElement = document.getElementById('currentTime');
    const orgElement = document.getElementById('org');

    try {
        // Get IP address using ipify
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) {
            throw new Error(`Error: IPify API returned status ${ipResponse.status}`);
        }
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        ipElement.textContent = ip;  // Update IP on the page

        // Now use ipapi.co to get information by IP
        const infoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!infoResponse.ok) {
            throw new Error(`Error: ipapi.co API returned status ${infoResponse.status}`);
        }
        const infoData = await infoResponse.json();

        // Update other data on the page
        locationElement.textContent = infoData.country_name;
        regionElement.textContent = infoData.region;
        cityElement.textContent = infoData.city;

        // Format current time information
        const timezone = infoData.timezone;
        const currentTime = new Date().toLocaleString("en-US", { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: true });
        currentTimeElement.textContent = currentTime;

        orgElement.textContent = infoData.org;

    } catch (error) {
        console.error("Error while getting data:", error.message);
        ipElement.textContent = "Error";
        locationElement.textContent = "Error";
        regionElement.textContent = "Error";
        cityElement.textContent = "Error";
        currentTimeElement.textContent = "Error";
        orgElement.textContent = "Error";
    }
});
