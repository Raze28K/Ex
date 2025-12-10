// Список городов и места (без изменений)
const cities = [
    { name: "Алматы", places: [ { name: "Ресторан A", lat: 43.235, lng: 76.945 }, { name: "Кафе B", lat: 43.241, lng: 76.923 }, { name: "Музей C", lat: 43.259, lng: 76.933 } ] },
    { name: "Астана", places: [ { name: "Ресторан D", lat: 51.128, lng: 71.414 }, { name: "Кафе E", lat: 51.132, lng: 71.427 } ] },
    { name: "Шымкент", places: [ { name: "Ресторан F", lat: 42.33, lng: 69.583 }, { name: "Кафе G", lat: 42.335, lng: 69.595 } ] }
];

// XP и уровень
let currentXP = 0;
const maxXP = 100;

// Попробуем взять уровень из элемента #lvl (если там "1" или "Уровень 1").
function readLevelFromDOM() {
    const raw = document.getElementById("lvl").textContent || "";
    // извлекаем первую встречающуюся цифру/число
    const m = raw.match(/\d+/);
    return m ? parseInt(m[0], 10) : 1;
}
let level = readLevelFromDOM(); // начальный уровень

// Обновление отображения уровня
function updateLevelDOM() {
    // если хочешь просто число, используй: document.getElementById("lvl").textContent = level;
    // если текст с пояснением:
    document.getElementById("lvl").textContent = `Уровень ${level}`;
}

// Обновление XP барa и текста
function updateXPDOM() {
    const xpBar = document.getElementById("xpBar");
    if (xpBar) xpBar.style.width = (currentXP / maxXP * 100) + "%";

    const xpText = document.getElementById("xpText");
    if (xpText) xpText.textContent = `XP: ${currentXP} / ${maxXP}`;
}

// Добавление XP и проверка на повышение уровня
function addXP(amount) {
    currentXP += amount;

    // если переполнено, переводим в следующий уровень (можно сохранить остаток)
    while (currentXP >= maxXP) {
        currentXP -= maxXP; // если хочешь сбрасывать до 0, используй currentXP = 0;
        level += 1;
    }

    updateXPDOM();
    updateLevelDOM();
}

// Функция выбора случайного места для карты (как было)
function randomPlace() {
    const city = cities[Math.floor(Math.random() * cities.length)];
    const place = city.places[Math.floor(Math.random() * city.places.length)];
    console.log(`Город: ${city.name}, место: ${place.name}`);
    const mapIframe = document.getElementById("map");
    if (mapIframe) mapIframe.src = `https://www.google.com/maps?q=${place.lat},${place.lng}&hl=ru&z=16&output=embed`;
}

// Обработчики кнопок (как у тебя)
const startBtn = document.getElementById("startBtn");
if (startBtn) startBtn.onclick = () => {
    const overlay = document.getElementById("overlay");
    if (overlay) overlay.style.display = "none";

    const mapArea = document.getElementById("mapArea");
    if (mapArea) mapArea.style.display = "block";

    randomPlace();

    const actionArea = document.getElementById("actionArea");
    if (actionArea) actionArea.style.display = "flex";
};

const clickLayer = document.getElementById("clickLayer");
const marker = document.getElementById("marker");
if (clickLayer && marker) {
    clickLayer.addEventListener("click", (e) => {
        const rect = clickLayer.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        marker.style.left = x + "px";
        marker.style.top = y + "px";
        marker.style.display = "block";
    });
}

const doneBtn = document.getElementById("doneBtn");
if (doneBtn) doneBtn.onclick = () => {
    addXP(10); // даём 10 XP за выполненное
};

// Инициализируем отображение при загрузке страницы
updateLevelDOM();
updateXPDOM();
