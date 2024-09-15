document.addEventListener('DOMContentLoaded', async () => {
<<<<<<< HEAD
    const statusText = document.getElementById('status-text');
    const toggleButton = document.getElementById('toggle-extension');

    // Получаем текущее состояние расширения из хранилища
    const { isEnabled } = await browser.storage.local.get('isEnabled');

    // Обновляем интерфейс в зависимости от состояния
    updateUI(isEnabled !== false);  // По умолчанию включено, если не установлено в хранилище

    // Добавляем обработчик для переключения состояния
    toggleButton.addEventListener('click', async () => {
        const { isEnabled } = await browser.storage.local.get('isEnabled');
        const newState = !isEnabled;  // Меняем текущее состояние

        // Сохраняем новое состояние в хранилище
        await browser.storage.local.set({ isEnabled: newState });

        // Обновляем интерфейс
        updateUI(newState);
    });

    // Функция для обновления интерфейса в popup
    function updateUI(isEnabled) {
        if (isEnabled) {
            statusText.textContent = "Расширение включено";
            toggleButton.textContent = "Выключить";
        } else {
            statusText.textContent = "Расширение выключено";
            toggleButton.textContent = "Включить";
        }
    }
=======
    const ipElement = document.getElementById('ip-address');
    const button = document.getElementById('update-flag');

    // Функция для получения IP
    async function getIpAddress() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    }

    // Обновляем IP при загрузке popup
    const ip = await getIpAddress();
    ipElement.textContent = ip;

    // Обработчик нажатия кнопки обновления флага
    button.addEventListener('click', async () => {
        // Получаем текущий активный tab
        const [tab] = await browser.tabs.query({ active: true, currentWindow: true });

        // Обновляем флаг вручную
        browser.runtime.sendMessage({ type: 'updateFlag', tabId: tab.id });
    });
>>>>>>> 5a89017ca5fef64770ea10665ebb9449af420e39
});
