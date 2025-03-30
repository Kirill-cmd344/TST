document.addEventListener("DOMContentLoaded", () => {
    const button = document.querySelector('.button');

    // Проверяем наличие кнопки на странице
    if (!button) {
        console.error("Кнопка с классом '.button' не найдена.");
        return;
    }

    button.addEventListener('click', () => {
        getLocation();
        getHardwareInfo();
    });
});

// Функция для получения геолокации пользователя
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;
                const accuracy = position.coords.accuracy;

                console.log(`Широта: ${latitude}`);
                console.log(`Долгота: ${longitude}`);
                console.log(`Точность: ${accuracy} метров`);

                // Выводим сообщение на странице
                displayInfo(`Ваше местоположение: Широта ${latitude}, Долгота ${longitude} (Точность: ${accuracy} м)`);
            },
            (error) => {
                console.error("Ошибка при получении геолокации:", error.message);

                // Вывод ошибки пользователю
                displayInfo(`Ошибка геолокации: ${error.message}`);
            }
        );
    } else {
        console.error("Геолокация не поддерживается этим браузером.");
        displayInfo("Геолокация не поддерживается вашим браузером.");
    }
}

// Функция для получения информации об аппаратном обеспечении
function getHardwareInfo() {
    const info = {
        platform: navigator.platform || "Недоступно", // Платформа
        userAgent: navigator.userAgent || "Недоступно", // Данные о браузере
        cores: navigator.hardwareConcurrency || "Недоступно", // Количество ядер процессора
        memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Недоступно", // Оперативная память
    };

    console.log("Информация об аппаратном обеспечении:", info);

    // Выводим информацию на странице
    displayInfo(`Аппаратная информация:
        Платформа: ${info.platform},
        Браузер: ${info.userAgent},
        Ядер процессора: ${info.cores},
        ОЗУ: ${info.memory}`);
}

// Универсальная функция для вывода информации на странице
function displayInfo(message) {
    const outputDiv = document.querySelector('.output');

    // Если блока вывода нет, создаём его
    if (!outputDiv) {
        const newOutput = document.createElement('div');
        newOutput.classList.add('output');
        document.body.appendChild(newOutput);
        newOutput.innerHTML = `<p>${message}</p>`;
    } else {
        outputDiv.innerHTML += `<p>${message}</p>`;
    }
}
