const timeDisplay = document.getElementById("time");
const dateDisplay = document.getElementById("date");
const moonPhaseDisplay = document.getElementById("moon-phase");
const moonIcon = document.getElementById("moon-icon");
const monthYear = document.getElementById("month-year");
const calendarBody = document.getElementById("calendar-body");
const toggleFormatBtn = document.getElementById("toggle-format");
const toggleColorBtn = document.getElementById("toggle-color");
const toggleSoundBtn = document.getElementById("toggle-sound");
const radsDisplay = document.getElementById("rads");
let currentDate = new Date();
let is24Hour = localStorage.getItem("is24Hour") === "false" ? false : true;
let colorIndex = localStorage.getItem("colorIndex") ? parseInt(localStorage.getItem("colorIndex")) : 0;
let soundEnabled = true;
const colors = ["#00FF00", "#FFAA00"]; // Verde y Ámbar
const sonido1 = new Audio("audio/sonido1.mp3");

function updateClock() {
    const now = new Date();
    timeDisplay.textContent = now.toLocaleTimeString("es-ES", { hour12: !is24Hour });
    dateDisplay.textContent = now.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const phase = getMoonPhase(now);
    moonPhaseDisplay.textContent = `LUNA: ${phase}`;
    moonIcon.textContent = getMoonIcon(phase);
    radsDisplay.textContent = `RADs: ${Math.floor(Math.random() * 50)}`;
    requestAnimationFrame(updateClock);
}
requestAnimationFrame(updateClock);

function getMoonPhase(date) {
    const cycle = 29.53;
    const knownNewMoon = new Date("2025-01-01").getTime();
    const diff = (date.getTime() - knownNewMoon) / (1000 * 60 * 60 * 24);
    const daysIntoCycle = diff % cycle;
    if (daysIntoCycle < 1.5) return "Nueva";
    if (daysIntoCycle < 13.5) return "Creciente";
    if (daysIntoCycle < 16.5) return "Llena";
    return "Menguante";
}

function getMoonIcon(phase) {
    switch (phase) {
        case "Nueva": return "🌑";
        case "Creciente": return "🌒";
        case "Llena": return "🌕";
        case "Menguante": return "🌘";
        default: return "";
    }
}

function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const today = new Date();

    monthYear.textContent = `${currentDate.toLocaleString("es-ES", { month: "long" })} ${year}`;
    
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = "";
    let day = 1;
    for (let i = 0; i < 6; i++) {
        html += "<tr>";
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                html += "<td></td>";
            } else if (day > daysInMonth) {
                html += "<td></td>";
            } else {
                const isToday = day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
                html += `<td class="${isToday ? "today" : ""}">${day}</td>`;
                day++;
            }
        }
        html += "</tr>";
        if (day > daysInMonth) break;
    }
    calendarBody.innerHTML = html;
}

function applyGlitch(element) {
    element.classList.add("glitch-effect");
    setTimeout(() => element.classList.remove("glitch-effect"), 200);
}

function updateColor() {
    const newColor = colors[colorIndex];
    document.body.style.color = newColor;
    document.querySelector("#retro-clock").style.borderColor = newColor;
    document.body.classList.toggle("amber", colorIndex === 1);
}

document.getElementById("prev-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
    playSound(sonido1);
    applyGlitch(timeDisplay);
});

document.getElementById("next-month").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
    playSound(sonido1);
    applyGlitch(timeDisplay);
});

toggleFormatBtn.addEventListener("click", () => {
    is24Hour = !is24Hour;
    localStorage.setItem("is24Hour", is24Hour);
    updateClock();
    playSound(sonido1);
    applyGlitch(timeDisplay);
});

toggleColorBtn.addEventListener("click", () => {
    colorIndex = (colorIndex + 1) % colors.length;
    localStorage.setItem("colorIndex", colorIndex);
    updateColor();
    playSound(sonido1);
    applyGlitch(timeDisplay);
});

toggleSoundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    toggleSoundBtn.textContent = soundEnabled ? "SONIDO" : "SILENCIO";
    playSound(sonido1);
    applyGlitch(timeDisplay);
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        playSound(sonido1);
        applyGlitch(timeDisplay);
    } else if (e.key === "ArrowRight") {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        playSound(sonido1);
        applyGlitch(timeDisplay);
    }
});

function playSound(sound) {
    if (soundEnabled && sound) {
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }
}

// Aplicar color inicial
updateColor();
renderCalendar();