document.addEventListener('DOMContentLoaded', async () => {
    const ipElement = document.getElementById('ip');
    const locationElement = document.getElementById('location');
    const regionElement = document.getElementById('region');
    const cityElement = document.getElementById('city');
    const timezoneElement = document.getElementById('timezone');
    const orgElement = document.getElementById('org');

    try {
        // Получаем IP-адрес с помощью ipify
        const ipResponse = await fetch('https://api.ipify.org?format=json');
        if (!ipResponse.ok) {
            throw new Error(`Ошибка: IPify API вернуло статус ${ipResponse.status}`);
        }
        const ipData = await ipResponse.json();
        const ip = ipData.ip;
        ipElement.textContent = ip;  // Обновляем IP на странице

        // Теперь используем ipapi.co для получения информации по IP
        const infoResponse = await fetch(`https://ipapi.co/${ip}/json/`);
        if (!infoResponse.ok) {
            throw new Error(`Ошибка: ipapi.co API вернуло статус ${infoResponse.status}`);
        }
        const infoData = await infoResponse.json();

        // Обновляем остальные данные на странице
        locationElement.textContent = infoData.country_name;
        regionElement.textContent = infoData.region;
        cityElement.textContent = infoData.city;
        timezoneElement.textContent = infoData.timezone;
        orgElement.textContent = infoData.org;

    } catch (error) {
        console.error("Ошибка при получении данных:", error.message);
        ipElement.textContent = "Ошибка";
        locationElement.textContent = "Ошибка";
        regionElement.textContent = "Ошибка";
        cityElement.textContent = "Ошибка";
        timezoneElement.textContent = "Ошибка";
        orgElement.textContent = "Ошибка";
    }
});
