/// Импортируем функции из модуля userDataService
import { getLocation, getHardwareInfo } from './userDataService.js';

// Функция, которая будет выполнена после загрузки DOM
function initApp() {
    console.log("DOM полностью загружен");
    
    // Находим кнопку для получения данных пользователя
    const userDataButton = document.getElementById('userDataButton');
    
    // Проверяем наличие кнопки на странице
    if (!userDataButton) {
        console.error("Кнопка с ID 'userDataButton' не найдена.");
        return;
    }
    
    console.log("Кнопка найдена:", userDataButton);
    
    // Добавляем прямой обработчик события клика
    userDataButton.onclick = async function() {
        console.log("Кнопка нажата!");
        
        try {
            // Показываем пользователю, что данные собираются
            displayInfo("Сбор данных о вашем устройстве...");
            
            // Получаем данные об аппаратном обеспечении
            const hardwareInfo = getHardwareInfo();
            const hardwareText = `Аппаратная информация:
Платформа: ${hardwareInfo.platform}
Браузер: ${hardwareInfo.userAgent}
Ядер процессора: ${hardwareInfo.cores}
ОЗУ: ${hardwareInfo.memory}`;
            
            displayInfo(hardwareText);
            
            // Запрашиваем разрешение на геолокацию
            displayInfo("Запрашиваем доступ к вашей геолокации...");
            
            // Получаем данные о местоположении
            let locationText = "";
            try {
                const locationData = await getLocation();
                locationText = `Ваше местоположение:
Широта: ${locationData.latitude}
Долгота: ${locationData.longitude}
Точность: ${locationData.accuracy} м`;
                
                displayInfo(locationText);
            } catch (error) {
                locationText = `Ошибка геолокации: ${error.message}`;
                displayInfo(locationText);
            }
            
            // Сохраняем данные в файл
            const timestamp = new Date().toISOString();
            const fileName = `user_data_${timestamp}.txt`;
            const fileContent = `Данные пользователя - ${timestamp}\n\n${hardwareText}\n\n${locationText}`;
            
            saveToFile(fileName, fileContent);
            
        } catch (error) {
            displayInfo(`Произошла ошибка: ${error.message}`);
        }
    };
}

// Функция для сохранения данных в файл
function saveToFile(filename, text) {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    
    // Очистка
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// Добавляем несколько способов инициализации для надежности
document.addEventListener("DOMContentLoaded", initApp);

// Резервный вариант, если DOMContentLoaded уже прошел
if (document.readyState === "complete" || document.readyState === "interactive") {
    setTimeout(initApp, 1);
}

// Функция для получения геолокации пользователя
function getLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    const accuracy = position.coords.accuracy;

                    resolve({ latitude, longitude, accuracy });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Геолокация не поддерживается этим браузером."));
        }
    });
}

// Функция для получения информации об аппаратном обеспечении
function getHardwareInfo() {
    const info = {
        platform: navigator.platform || "Недоступно", // Платформа
        userAgent: navigator.userAgent || "Недоступно", // Данные о браузере
        cores: navigator.hardwareConcurrency || "Недоступно", // Количество ядер процессора
        memory: navigator.deviceMemory ? `${navigator.deviceMemory} GB` : "Недоступно", // Оперативная память
    };

    return info;
}

// Универсальная функция для вывода информации на странице
function displayInfo(message) {
    console.log("Отображение информации:", message);
    
    // Ищем или создаем блок вывода
    let outputDiv = document.querySelector('.output');
    
    if (!outputDiv) {
        console.log("Создание нового блока вывода");
        outputDiv = document.createElement('div');
        outputDiv.classList.add('output');
        
        // Добавляем блок вывода на страницу
        const main = document.querySelector('main');
        if (main) {
            // Если есть main, вставляем в конец main
            main.appendChild(outputDiv);
        } else {
            // Если нет main, добавляем в body
            document.body.appendChild(outputDiv);
        }
        
        console.log("Блок вывода создан и добавлен на страницу");
    }
    
    // Добавляем новое сообщение
    const messageElement = document.createElement('p');
    messageElement.textContent = message;
    outputDiv.appendChild(messageElement);
    
    console.log("Сообщение добавлено в блок вывода");
    
    // Прокручиваем к новому сообщению
    try {
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'end' });
    } catch (error) {
        console.error("Ошибка при прокрутке:", error);
    }
}