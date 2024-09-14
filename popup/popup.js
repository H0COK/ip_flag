document.addEventListener('DOMContentLoaded', async () => {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    document.getElementById('ip-address').textContent = data.ip;
});
