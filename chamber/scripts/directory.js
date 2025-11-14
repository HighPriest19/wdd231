// ============================
// CONSTANTS
// ============================
const lat = 7.2500; // Ondo, Nigeria latitude
const lon = 5.1950; // Ondo, Nigeria longitude
const API_KEY = '2a7c410ae5711bad39818da0723796d6'; // OpenWeather API key

// ============================
// THEME TOGGLE
// ============================
const themeToggle = document.getElementById('themeToggle');

function createThemeDropdown() {
    if (!themeToggle) return null;

    const dropdown = document.createElement('div');
    dropdown.id = 'themeDropdown';
    dropdown.className = 'theme-dropdown';
    dropdown.innerHTML = `
        <button class="theme-option" data-theme="light"><span>☀</span> Light</button>
        <button class="theme-option" data-theme="dark"><span>🌙</span> Dark</button>
        <button class="theme-option" data-theme="auto"><span>🌓</span> Auto</button>
    `;
    themeToggle.parentNode.insertBefore(dropdown, themeToggle.nextSibling);
    return dropdown;
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.classList.toggle('dark-mode', prefersDark);
        updateThemeIcon(prefersDark ? '🌙' : '☀');
    } else {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        updateThemeIcon(theme === 'dark' ? '🌙' : '☀');
    }
}

function updateThemeIcon(icon) {
    if (themeToggle) themeToggle.textContent = icon;
}

const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme);

if (themeToggle) {
    const dropdown = createThemeDropdown();
    if (dropdown) {
        themeToggle.addEventListener('click', e => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });

        dropdown.addEventListener('click', e => {
            const button = e.target.closest('.theme-option');
            if (!button) return;

            const selectedTheme = button.dataset.theme;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);

            dropdown.querySelectorAll('.theme-option').forEach(opt => opt.classList.remove('active'));
            button.classList.add('active');
            dropdown.classList.remove('show');
        });

        const activeOption = dropdown.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeOption) activeOption.classList.add('active');

        document.addEventListener('click', e => {
            if (!dropdown.contains(e.target) && e.target !== themeToggle) {
                dropdown.classList.remove('show');
            }
        });
    }
}

if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', () => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') applyTheme('auto');
    });
}

// ============================
// MOBILE MENU TOGGLE
// ============================
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mainNav = document.getElementById('mainNav');

if (mobileMenuToggle && mainNav) {
    mobileMenuToggle.addEventListener('click', () => {
        mainNav.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });
}

// ============================
// DIRECTORY VIEW TOGGLE
// ============================
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const memberDirectory = document.getElementById('memberDirectory');

if (gridBtn && listBtn && memberDirectory) {
    gridBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-grid';
        gridBtn.classList.add('active');
        listBtn.classList.remove('active');
    });
    listBtn.addEventListener('click', () => {
        memberDirectory.className = 'member-list';
        listBtn.classList.add('active');
        gridBtn.classList.remove('active');
    });
}

// ============================
// LOAD MEMBERS & FEATURED SPOTLIGHTS
// ============================
async function loadMembers() {
    if (!memberDirectory) return;
    try {
        console.debug('loadMembers: attempting to fetch data/members.json');
        const res = await fetch('data/members.json');
        if (!res.ok) throw new Error('Unable to fetch members.json');
        const members = await res.json();
        displayMembers(members);
        displaySpotlights(members);
    } catch (err) {
        console.error('Error loading members:', err);
        // show error in either the directory or the spotlights grid (or both)
        if (memberDirectory) memberDirectory.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
        const spotlightsGrid = document.getElementById('spotlightsGrid');
        if (spotlightsGrid) spotlightsGrid.innerHTML = '<p class="no-spotlights">Error loading featured members. Check network or run the site via HTTP server.</p>';
    }
}

function displayMembers(members) {
    if (!memberDirectory) return;
    memberDirectory.innerHTML = '';
    members.forEach(member => {
        const badgeClass =
            member.membershipLevel === 4 ? 'badge-diamond' :
            member.membershipLevel === 3 ? 'badge-gold' :
            member.membershipLevel === 2 ? 'badge-silver' :
            member.membershipLevel === 1 ? 'badge-bronze' :
            'badge-member';
        const badgeText =
            member.membershipLevel === 4 ? '💎 Diamond Member' :
            member.membershipLevel === 3 ? '🥇 Gold Member' :
            member.membershipLevel === 2 ? '🥈 Silver Member' :
            member.membershipLevel === 1 ? '🥉 Bronze Member' :
            'Member';

        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';
        memberCard.innerHTML = `
            <img src="${member.image}" alt="${escapeHtml(member.name)}" class="member-image" loading="lazy" onerror="this.onerror=null;this.src='images/och-logo.png'">
            <div class="member-info">
                <h3>${escapeHtml(member.name)}</h3>
                <p class="member-tagline">${escapeHtml(member.tagline)}</p>
                <div class="member-details">
                    ${member.address ? `<p>📍 ${escapeHtml(member.address)}</p>` : ''}
                    ${member.phone ? `<p>📞 <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                    ${member.website ? `<p>🌐 <a href="${member.website}" target="_blank">${escapeHtml(member.website)}</a></p>` : ''}
                    ${member.email ? `<p>✉ <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                </div>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;
        memberDirectory.appendChild(memberCard);
    });
}

// FEATURED MEMBERS
function displaySpotlights(members) {
    const spotlightsGrid = document.getElementById('spotlightsGrid');
    if (!spotlightsGrid) return;

    // Only include Silver (2) members for the featured spotlights on index.html
    const qualified = members.filter(m => m.membershipLevel === 2);
    if (!qualified.length) {
        spotlightsGrid.innerHTML = '<p class="no-spotlights">No featured members at this time.</p>';
        console.debug('displaySpotlights: no qualified members found');
        return;
    }

    const count = qualified.length >= 3 ? 3 : qualified.length;
    const selected = getRandomMembers(qualified, count);

    console.debug(`displaySpotlights: members=${members.length}, qualified=${qualified.length}, selected=${selected.length}`);

    spotlightsGrid.innerHTML = selected.map(member => {
        const badgeClass = 'badge-silver';
        const badgeText = ' Silver Member';
        return `
            <div class="spotlight-card">
                <img src="${member.image}" alt="${escapeHtml(member.name)}" class="spotlight-image" loading="lazy" onerror="this.onerror=null;this.src='images/och-logo.png'">
                <div class="spotlight-info">
                    <h3>${escapeHtml(member.name)}</h3>
                    <p>${escapeHtml(member.tagline)}</p>
                    ${member.phone ? `<p>📞 <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                    ${member.email ? `<p>✉ <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                    ${member.website ? `<p>🌐 <a href="${member.website}" target="_blank">${escapeHtml(member.website)}</a></p>` : ''}
                    <span class="membership-badge ${badgeClass}">${badgeText}</span>
                </div>
            </div>
        `;
    }).join('');
}

function getRandomMembers(arr, count) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// ============================
// WEATHER
// ============================
async function fetchCurrentWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Weather data unavailable');
        const data = await res.json();
        displayCurrentWeather(data);
    } catch (err) {
        console.error(err);
        const temp = document.getElementById('currentTemp');
        const desc = document.getElementById('weatherDescription');
        if (temp) temp.textContent = 'N/A';
        if (desc) desc.textContent = 'Unable to load weather';
    }
}

function displayCurrentWeather(data) {
    if (!data) return;
    const iconEl = document.getElementById('weatherIcon');
    const tempEl = document.getElementById('currentTemp');
    const descEl = document.getElementById('weatherDescription');
    const highEl = document.getElementById('highTemp');
    const lowEl = document.getElementById('lowTemp');
    const humidityEl = document.getElementById('humidity');
    const sunriseEl = document.getElementById('sunrise');
    const sunsetEl = document.getElementById('sunset');

    if (iconEl) {
        iconEl.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
        iconEl.alt = data.weather[0].description;
    }
    if (tempEl) tempEl.textContent = `${Math.round(data.main.temp)}°F`;
    if (descEl) descEl.textContent = data.weather[0].description;
    if (highEl) highEl.textContent = `${Math.round(data.main.temp_max)}°F`;
    if (lowEl) lowEl.textContent = `${Math.round(data.main.temp_min)}°F`;
    if (humidityEl) humidityEl.textContent = `${data.main.humidity}%`;

    if (sunriseEl) sunriseEl.textContent = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
    if (sunsetEl) sunsetEl.textContent = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', { hour:'numeric', minute:'2-digit', hour12:true });
}

async function fetchWeatherForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Forecast unavailable');
        const data = await res.json();
        displayWeatherForecast(data);
    } catch (err) {
        console.error(err);
        const forecastList = document.getElementById('forecastList');
        if (forecastList) forecastList.innerHTML = '<p>Unable to load forecast</p>';
    }
}

function displayWeatherForecast(data) {
    const forecastList = document.getElementById('forecastList');
    if (!forecastList || !data) return;

    const dailyForecasts = [];
    const datesAdded = new Set();

    for (let item of data.list) {
        const date = new Date(item.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (!datesAdded.has(dayName) && dailyForecasts.length < 3) {
            dailyForecasts.push({
                day: dayName,
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon
            });
            datesAdded.add(dayName);
        }
    }

    forecastList.innerHTML = dailyForecasts.map(f => `
        <div class="forecast-item">
            <img src="https://openweathermap.org/img/wn/${f.icon}.png" alt="Weather icon">
            <span class="forecast-day-name">${f.day}</span>
            <span class="forecast-temp">${f.temp}°F</span>
        </div>
    `).join('');
}

// ============================
// UTILITIES
// ============================
function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/'/g,'&#39;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function updateFooter() {
    const yearEl = document.getElementById('currentYear');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    const lastModEl = document.getElementById('lastModified');
    if (lastModEl) lastModEl.textContent = new Date(document.lastModified).toLocaleDateString('en-US', { year:'numeric', month:'long', day:'numeric', hour:'2-digit', minute:'2-digit', second:'2-digit' });
}

// ============================
// INITIALIZE
// ============================
document.addEventListener('DOMContentLoaded', () => {
    updateFooter();
    // Load members if this page has either the full directory or the spotlights grid
    if (memberDirectory || document.getElementById('spotlightsGrid')) loadMembers();
    if (document.getElementById('currentTemp')) {
        fetchCurrentWeather();
        fetchWeatherForecast();
    }

    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => img.addEventListener('load', () => img.setAttribute('data-loaded','true')));
});