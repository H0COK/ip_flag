let currentIp = null;

async function getIpAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
}

async function getCountryFromIp(ip) {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    const data = await response.json();
    return data.country;
}

async function updateFlagIcon(tabId) {
    const newIp = await getIpAddress();

    // Проверяем, изменился ли IP
    if (newIp !== currentIp) {
        currentIp = newIp;  // Обновляем текущий IP
        const country = await getCountryFromIp(newIp);

        // Загружаем и устанавливаем иконку флага
        const iconUrl = `https://flagcdn.com/48x36/${country.toLowerCase()}.png`;

        // Показываем page_action иконку в URL-баре
        browser.pageAction.setIcon({ tabId: tabId, path: iconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: `IP: ${newIp}` });
        browser.pageAction.show(tabId);  // Активируем иконку в URL-баре
    }
}

// Обрабатываем обновление при активации вкладки
browser.tabs.onActivated.addListener(async (activeInfo) => {
    updateFlagIcon(activeInfo.tabId);
});

// Обрабатываем обновление при загрузке страницы
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateFlagIcon(tabId);
    }
});
