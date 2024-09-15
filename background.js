// Функция для получения текущего IP через ipify
async function getIpAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json');
        if (!response.ok) {
            throw new Error(`Ошибка: API вернуло статус ${response.status}`);
        }
        const data = await response.json();
        console.log("Получен IP:", data.ip);
        return data.ip;
    } catch (error) {
        console.error("Ошибка при получении IP:", error.message);
        throw new Error("Не удалось получить IP. Проверьте подключение к интернету.");
    }
}

// Функция для получения информации о стране через ipapi.co
async function getCountryFromIp(ip) {
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!response.ok) {
            throw new Error(`Ошибка: API ipapi.co вернуло статус ${response.status}`);
        }
        const data = await response.json();
        console.log("Информация по IP:", data);
        return data.country_code;
    } catch (error) {
        console.error("Ошибка при получении информации о стране:", error.message);
        throw new Error("Не удалось получить информацию о стране.");
    }
}

// Функция для обновления иконки флага
async function updateFlagIcon(tabId) {
    try {
        // Проверяем, включено ли расширение
        const { isEnabled } = await browser.storage.local.get('isEnabled');

        if (isEnabled === false) {
            // Если выключено, скрываем иконку
            browser.pageAction.hide(tabId);
            return;
        }

        // Получаем IP-адрес
        const ip = await getIpAddress();

        // Получаем страну по IP
        const country = await getCountryFromIp(ip);
        const iconUrl = `https://flagcdn.com/48x36/${country.toLowerCase()}.png`;

        // Устанавливаем иконку флага в URL-баре
        browser.pageAction.setIcon({ tabId: tabId, path: iconUrl });
        browser.pageAction.setTitle({ tabId: tabId, title: `IP: ${ip}` });
        browser.pageAction.show(tabId);  // Показываем иконку
    } catch (error) {
        console.error("Ошибка обновления флага:", error.message);

        // Устанавливаем иконку ошибки
        const errorIconUrl = "icons/error-48.png";
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
