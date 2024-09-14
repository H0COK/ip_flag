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

    if (newIp !== currentIp) {
        currentIp = newIp;
        const country = await getCountryFromIp(newIp);
        const iconUrl = `https://flagcdn.com/48x36/${country.toLowerCase()}.png`;

        // Устанавливаем новую иконку в URL-баре
        browser.pageAction.setIcon({ tabId: tabId, path: iconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: `IP: ${newIp}` });
        browser.pageAction.show(tabId);  // Активируем иконку
    }
}

// Обработка обновления при загрузке страниц
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateFlagIcon(tabId);
    }
});

// Добавляем обработчик для сообщения на обновление флага вручную
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'updateFlag') {
        updateFlagIcon(message.tabId);  // Обновляем флаг для указанной вкладки
    }
});
