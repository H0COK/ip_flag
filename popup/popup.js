document.addEventListener('DOMContentLoaded', async () => {
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
});
