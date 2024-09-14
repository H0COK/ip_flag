document.addEventListener('DOMContentLoaded', async () => {
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
});
