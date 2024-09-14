let currentIp = null;

async function getIpAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    if (!response.ok) {
        throw new Error("Ошибка получения IP");
    }
    const data = await response.json();
    return data.ip;
}

async function getCountryFromIp(ip) {
    const response = await fetch(`https://ipinfo.io/${ip}/json`);
    if (!response.ok) {
        throw new Error("Ошибка получения информации о стране");
    }
    const data = await response.json();
    return data.country;
}

async function updateFlagIcon(tabId) {
    try {
        // Проверяем, включено ли расширение
        const { isEnabled } = await browser.storage.local.get('isEnabled');

        if (isEnabled === false) {
            // Если выключено, скрываем иконку
            browser.pageAction.hide(tabId);
            return;
        }

        // Получаем и обновляем IP, если расширение включено
        const newIp = await getIpAddress();

        if (newIp !== currentIp) {
            currentIp = newIp;
            const country = await getCountryFromIp(newIp);
            const iconUrl = `https://flagcdn.com/48x36/${country.toLowerCase()}.png`;

            // Устанавливаем иконку флага в URL-баре
            browser.pageAction.setIcon({ tabId: tabId, path: iconUrl });
            browser.pageAction.setTitle({ tabId: tabId, title: `IP: ${newIp}` });
            browser.pageAction.show(tabId);  // Показываем иконку
        }
    } catch (error) {
        console.error("Ошибка обновления флага:", error);

        const errorIconUrl = "icons/error-48.png";  // Иконка ошибки
        browser.pageAction.setIcon({ tabId: tabId, path: errorIconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: "Ошибка получения IP" });
        browser.pageAction.show(tabId);  // Показываем иконку ошибки
    }
}

// Обработчик для переключения вкладок
browser.tabs.onActivated.addListener(async (activeInfo) => {
    updateFlagIcon(activeInfo.tabId);
});

// Обработчик для обновления страницы
browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
        updateFlagIcon(tabId);
    }
});

// Инициализация иконки при запуске расширения
browser.tabs.query({}).then(tabs => {
    for (let tab of tabs) {
        updateFlagIcon(tab.id);
    }
});
