/**
 * userDataService.js - Модуль для получения пользовательских данных
 * Предоставляет функции для сбора информации об устройстве и геолокации пользователя
 */

/**
 * Функция для получения геолокации пользователя
 * @returns {Promise} Promise, который разрешается объектом с данными о местоположении
 */
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const locationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    };
                    
                    console.log(`Широта: ${locationData.latitude}`);
                    console.log(`Долгота: ${locationData.longitude}`);
                    console.log(`Точность: ${locationData.accuracy} метров`);
                    
                    resolve(locationData);
                },
                (error) => {
                    console.error("Ошибка при получении геолокации:", error.message);
                    reject(error);
                },
                { 
                    enableHighAccuracy: true, 
                    timeout: 10000, 
                    maximumAge: 0 
                }
            );
        } else {
            const error = new Error("Геолокация не поддерживается этим браузером.");
            console.error(error.message);
            reject(error);
        }
    });
}

/**
 * Функция для получения информации об аппаратном обеспечении
 * @returns {Object} Объект с данными об устройстве пользователя
 */
function getHardwareInfo() {
    const hardwareInfo = {
        platform: navigator.platform || "Недоступно", // Платформа
        userAgent: navigator.userAgent || "Недоступно", // Данные о браузере
        cores: navigator.hardwareConcurrency || "Недоступно", // Количество ядер процессора
        memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Недоступно", // Оперативная память
        language: navigator.language || "Недоступно", // Язык браузера
        cookiesEnabled: navigator.cookieEnabled ? "Да" : "Нет", // Включены ли куки
        onLine: navigator.onLine ? "Да" : "Нет" // Подключен ли к интернету
    };

    console.log("Информация об аппаратном обеспечении:", hardwareInfo);
    
    return hardwareInfo;
}

// Экспорт функций для использования в других файлах
export { getLocation, getHardwareInfo };
