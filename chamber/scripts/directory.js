// ============================
// CONSTANTS
// ============================
const lat = 7.2500; // Ondo, Nigeria latitude
const lon = 5.1950; // Ondo, Nigeria longitude
const API_KEY = '2a7c410ae5711bad39818da0723796d6'; // OpenWeather API key


// ============================
// THEME TOGGLE FUNCTIONALITY
// ============================
const themeToggle = document.getElementById('themeToggle');

function createThemeDropdown() {
    // Check if the dropdown already exists
    let dropdown = document.getElementById('themeDropdown');
    if (dropdown) return dropdown; 
    
    if (!themeToggle) return;
    
    dropdown = document.createElement('div');
    dropdown.id = 'themeDropdown';
    dropdown.className = 'theme-dropdown';
    dropdown.innerHTML = `
        <button class="theme-option" data-theme="light">
            <span class="theme-icon">☀</span> Light
        </button>
        <button class="theme-option" data-theme="dark">
            <span class="theme-icon">🌙</span> Dark
        </button>
        <button class="theme-option" data-theme="auto">
            <span class="theme-icon">🌓</span> Auto
        </button>
    `;
    
    themeToggle.parentNode.insertBefore(dropdown, themeToggle.nextSibling);
    return dropdown;
}

function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
            document.body.classList.add('dark-mode');
            updateThemeIcon('🌙');
        } else {
            document.body.classList.remove('dark-mode');
            updateThemeIcon('☀');
        }
    } else if (theme === 'dark') {
        document.body.classList.add('dark-mode');
        updateThemeIcon('🌙');
    } else {
        document.body.classList.remove('dark-mode');
        updateThemeIcon('☀');
    }
}

function updateThemeIcon(icon) {
    if (themeToggle) {
        themeToggle.textContent = icon;
    }
}

// Initial theme application setup:
const savedTheme = localStorage.getItem('theme') || 'auto';
applyTheme(savedTheme);

// Theme Toggle Event Listeners
if (themeToggle) {
    const dropdown = createThemeDropdown();
    
    if (dropdown) {
        themeToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('show');
        });
        
        dropdown.addEventListener('click', (e) => {
            const button = e.target.closest('.theme-option');
            if (!button) return;
            
            const selectedTheme = button.dataset.theme;
            localStorage.setItem('theme', selectedTheme);
            applyTheme(selectedTheme);
            dropdown.classList.remove('show');
            
            // Update active class on dropdown options
            dropdown.querySelectorAll('.theme-option').forEach(opt => {
                opt.classList.remove('active');
            });
            button.classList.add('active');
        });
        
        // Set initial active option
        const activeOption = dropdown.querySelector(`[data-theme="${savedTheme}"]`);
        if (activeOption) activeOption.classList.add('active');
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== themeToggle) {
                dropdown.classList.remove('show');
            }
        });
    }
}

// Auto-theme listener for system preference change
if (window.matchMedia) {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeQuery.addEventListener('change', (e) => {
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'auto') {
            applyTheme('auto');
        }
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
// ACTIVE PAGE NAVIGATION (FIX FOR NAVIGATION & WAYFINDING)
// ============================
function setActivePage() {
    const navLinks = document.querySelectorAll('nav a');
    const currentURL = window.location.href;

    navLinks.forEach((link) => {
        // Remove active class from all links first
        link.classList.remove('active');
        
        // Add active class to the current page link
        if (currentURL === link.href || currentURL.includes(link.getAttribute('href'))) {
            link.classList.add('active');
        }
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
// DIRECTORY - LOAD MEMBERS
// ============================
async function loadMembers() {
    if (!memberDirectory) return;
    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        const members = await response.json();
        displayMembers(members);
    } catch (error) {
        console.error('Error loading members:', error);
        memberDirectory.innerHTML = '<p>Error loading member directory. Please try again later.</p>';
    }
}

function displayMembers(members) {
    if (!memberDirectory) return;
    memberDirectory.innerHTML = '';

    members.forEach(member => {
        const memberCard = document.createElement('div');
        memberCard.className = 'member-card';

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

        memberCard.innerHTML = `
            <img src="${member.image || ''}" alt="${escapeHtml(member.name)}" class="member-image" loading="lazy">
            <div class="member-info">
                <h3>${escapeHtml(member.name)}</h3>
                <p class="member-tagline">${escapeHtml(member.tagline || '')}</p>
                <div class="member-details">
                    ${member.address ? `<p>📍 ${escapeHtml(member.address)}</p>` : ''}
                    ${member.phone ? `<p>📞 <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                    ${member.website ? `<p>🌐 <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p>` : ''}
                    ${member.email ? `<p>✉ <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                </div>
                <span class="membership-badge ${badgeClass}">${badgeText}</span>
            </div>
        `;

        memberDirectory.appendChild(memberCard);
    });
}

// ============================
// HOME PAGE - WEATHER API
// ============================
async function fetchCurrentWeather() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Weather data not available');
        
        const data = await response.json();
        displayCurrentWeather(data);
    } catch (error) {
        console.error('Error fetching current weather:', error);
        const weatherIcon = document.getElementById('weatherIcon');
        const currentTemp = document.getElementById('currentTemp');
        const weatherDescription = document.getElementById('weatherDescription');
        
        if (weatherIcon) weatherIcon.alt = 'Weather unavailable';
        if (currentTemp) currentTemp.textContent = 'N/A';
        if (weatherDescription) weatherDescription.textContent = 'Unable to load weather data';
    }
}

function displayCurrentWeather(data) {
    const weatherIcon = document.getElementById('weatherIcon');
    const currentTemp = document.getElementById('currentTemp');
    const weatherDescription = document.getElementById('weatherDescription');
    const highTemp = document.getElementById('highTemp');
    const lowTemp = document.getElementById('lowTemp');
    const humidity = document.getElementById('humidity');
    const sunrise = document.getElementById('sunrise');
    const sunset = document.getElementById('sunset');

    if (weatherIcon) {
        const iconCode = data.weather[0].icon;
        weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
        weatherIcon.alt = data.weather[0].description;
    }

    if (currentTemp) currentTemp.textContent = `${Math.round(data.main.temp)}°F`;
    if (weatherDescription) weatherDescription.textContent = data.weather[0].description;
    if (highTemp) highTemp.textContent = `${Math.round(data.main.temp_max)}°F`;
    if (lowTemp) lowTemp.textContent = `${Math.round(data.main.temp_min)}°F`;
    if (humidity) humidity.textContent = `${data.main.humidity}%`;

    if (sunrise) {
        const sunriseTime = new Date(data.sys.sunrise * 1000);
        sunrise.textContent = sunriseTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    if (sunset) {
        const sunsetTime = new Date(data.sys.sunset * 1000);
        sunset.textContent = sunsetTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }
}

// ============================
// HOME PAGE - WEATHER FORECAST
// ============================
async function fetchWeatherForecast() {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) throw new Error('Forecast data not available');
        
        const data = await response.json();
        displayWeatherForecast(data);
    } catch (error) {
        console.error('Error fetching weather forecast:', error);
        const forecastList = document.getElementById('forecastList');
        if (forecastList) {
            forecastList.innerHTML = '<p>Unable to load forecast data</p>';
        }
    }
}

function displayWeatherForecast(data) {
    const forecastList = document.getElementById('forecastList');
    if (!forecastList) return;

    // Get forecasts for the next 3 days (at noon)
    const dailyForecasts = [];
    const processedDates = new Set();

    for (let item of data.list) {
        const date = new Date(item.dt * 1000);
        const dateString = date.toLocaleDateString();
        const hour = date.getHours();

        // Get one forecast per day around midday (11am-1pm)
        if (hour >= 11 && hour <= 13 && !processedDates.has(dateString) && dailyForecasts.length < 3) {
            dailyForecasts.push({
                day: date.toLocaleDateString('en-US', { weekday: 'long' }),
                temp: Math.round(item.main.temp),
                icon: item.weather[0].icon,
                description: item.weather[0].description
            });
            processedDates.add(dateString);
        }
    }

    forecastList.innerHTML = dailyForecasts.map(forecast => `
        <div class="forecast-item">
            <span class="forecast-day-name">${forecast.day}</span>
            <span class="forecast-temp">${forecast.temp}°F</span>
        </div>
    `).join('');
}

// ============================
// HOME PAGE - MEMBER SPOTLIGHTS
// ============================
async function loadSpotlights() {
    const spotlightsGrid = document.getElementById('spotlightsGrid');
    if (!spotlightsGrid) return;

    try {
        const response = await fetch('data/members.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const members = await response.json();
        displaySpotlights(members, spotlightsGrid);
    } catch (error) {
        console.error('Error loading spotlights:', error);
        spotlightsGrid.innerHTML = '<p>Error loading member spotlights. Please try again later.</p>';
    }
}

function displaySpotlights(members, container) {
    // Filter for Gold (3) and Silver (2) members only
    const qualifiedMembers = members.filter(member => 
        member.membershipLevel === 3 || member.membershipLevel === 2
    );

    // Randomly select 2 or 3 members per assignment requirements
    const numSpotlights = Math.random() > 0.5 ? 3 : 2;
    const selectedMembers = getRandomMembers(qualifiedMembers, numSpotlights);

    container.innerHTML = selectedMembers.map(member => {
        const badgeClass = member.membershipLevel === 3 ? 'badge-gold' : 'badge-silver';
        const badgeText = member.membershipLevel === 3 ? '🥇 Gold Member' : '🥈 Silver Member';

        return `
            <div class="spotlight-card">
                <div class="spotlight-header">
                    <h3>${escapeHtml(member.name)}</h3>
                    <p class="spotlight-tagline">${escapeHtml(member.tagline || '')}</p>
                </div>
                <div class="spotlight-content">
                    <div class="spotlight-image-wrapper">
                        <img src="${member.image}" alt="${escapeHtml(member.name)}" class="spotlight-image" loading="lazy">
                    </div>
                    <div class="spotlight-contact">
                        ${member.email ? `<p>EMAIL: <a href="mailto:${member.email}">${escapeHtml(member.email)}</a></p>` : ''}
                        ${member.phone ? `<p>PHONE: <a href="tel:${member.phone}">${escapeHtml(member.phone)}</a></p>` : ''}
                        ${member.website ? `<p>URL: <a href="${member.website}" target="_blank" rel="noopener">${escapeHtml(member.website)}</a></p>` : ''}
                        <span class="membership-badge ${badgeClass}">${badgeText}</span>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function getRandomMembers(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, shuffled.length));
}

// ===================================
// W04 JOIN PAGE FUNCTIONALITY
// ===================================

/**
 * Sets the current date and time in the hidden timestamp field on join.html.
 */
function setFormTimestamp() {
    // Only run if the timestamp field element exists
    const timestampField = document.getElementById('timestamp');
    if (timestampField) {
        const now = new Date();
        // Use ISO String for precise, standardized date/time submission
        timestampField.value = now.toISOString(); 
    }
}

/**
 * Displays submitted form data on the thankyou.html page.
 */
function displayThankYouData() {
    const displaySection = document.getElementById('form-data-display');
    
    // Only run if we are on the thankyou page
    if (!displaySection) return; 

    const params = new URLSearchParams(window.location.search);

    // Define the required fields to display (must match 'name' attributes in join.html form)
    const fieldsToDisplay = {
        'fname': "First Name",
        'lname': "Last Name",
        'email': "Email Address",
        'phone': "Mobile Number",
        'orgname': "Business Name",
        'timestamp': "Application Time"
    };

    let htmlContent = '<ul>';

    for (const [paramName, friendlyName] of Object.entries(fieldsToDisplay)) {
        const value = params.get(paramName);
        if (value) {
            let displayValue = value;
            
            // Format the timestamp for better readability
            if (paramName === 'timestamp') {
                try {
                    const date = new Date(value);
                    displayValue = date.toLocaleDateString('en-US') + ' at ' + date.toLocaleTimeString('en-US');
                } catch (e) {
                    // Fallback to raw value
                }
            }
            
            htmlContent += `<li><strong>${friendlyName}:</strong> ${displayValue}</li>`;
        }
    }

    htmlContent += '</ul>';
    
    // Append content, preserving any initial message in the div
    displaySection.innerHTML += htmlContent;
}

/**
 * Setup modal dialogs (W04 Requirement: Use HTML5 dialog element)
 */
function setupModals() {
    // Get all modal trigger buttons
    const modalButtons = document.querySelectorAll('.modal-link[data-modal]');
    
    modalButtons.forEach(button => {
        button.addEventListener('click', () => {
            const modalId = button.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.showModal();
                
                // Close button inside modal
                const closeButton = modal.querySelector('.close-modal');
                if (closeButton) {
                    closeButton.addEventListener('click', () => {
                        modal.close();
                    });
                }
                
                // Close when clicking outside the modal (W04 Requirement)
                modal.addEventListener('click', (e) => {
                    const dialogDimensions = modal.getBoundingClientRect();
                    if (
                        e.clientX < dialogDimensions.left ||
                        e.clientX > dialogDimensions.right ||
                        e.clientY < dialogDimensions.top ||
                        e.clientY > dialogDimensions.bottom
                    ) {
                        modal.close();
                    }
                });
            }
        });
    });
}

// ===================================
// W05 DISCOVER PAGE FUNCTIONALITY
// ===================================

/**
 * Load and display attractions on discover page
 */
async function loadAttractions() {
    const attractionsGrid = document.getElementById('attractionsGrid');
    if (!attractionsGrid) return; // Only run if on discover page

    try {
        // Fetch attractions data
        const response = await fetch('data/attractions.json');
        if (!response.ok) throw new Error('Network response was not ok');
        
        const attractions = await response.json();
        displayAttractions(attractions, attractionsGrid);
    } catch (error) {
        console.error('Error loading attractions:', error);
        attractionsGrid.innerHTML = '<p>Error loading attractions. Please try again later.</p>';
    }
}

/**
 * Display attractions in grid
 */
function displayAttractions(attractions, container) {
    container.innerHTML = '';

    attractions.forEach(attraction => {
        const card = document.createElement('div');
        card.className = 'attraction-card';

        card.innerHTML = `
            <h2>${escapeHtml(attraction.name)}</h2>
            <figure>
                <img src="${attraction.image}" 
                     alt="${escapeHtml(attraction.name)}" 
                     loading="lazy"
                     width="300" 
                     height="200">
            </figure>
            <address>${escapeHtml(attraction.address)}</address>
            <p>${escapeHtml(attraction.description)}</p>
            <button type="button" onclick="window.open('https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(attraction.address)}', '_blank')">
                Learn More
            </button>
        `;

        container.appendChild(card);
    });
}

/**
 * Display visit message using localStorage
 */
function displayVisitMessage() {
    const visitMessageContainer = document.getElementById('visitMessage');
    if (!visitMessageContainer) return; // Only run if on discover page

    const now = Date.now();
    const lastVisit = localStorage.getItem('lastVisitDiscover');

    let message = '';

    if (!lastVisit) {
        // First visit
        message = '🎉 Welcome! Let us know if you have any questions.';
    } else {
        const lastVisitTime = parseInt(lastVisit);
        const timeDiff = now - lastVisitTime;
        const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));

        if (daysDiff < 1) {
            // Less than a day
            message = '👋 Back so soon! Awesome!';
        } else if (daysDiff === 1) {
            // Exactly 1 day
            message = `📅 You last visited 1 day ago.`;
        } else {
            // More than 1 day
            message = `📅 You last visited ${daysDiff} days ago.`;
        }
    }

    // Store current visit
    localStorage.setItem('lastVisitDiscover', now.toString());

    // Display message
    visitMessageContainer.textContent = message;
}

// ============================
// UTILITY FUNCTIONS
// ============================
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function updateFooter() {
    const currentYearEl = document.getElementById('currentYear');
    if (currentYearEl) currentYearEl.textContent = new Date().getFullYear();

    const lastModifiedEl = document.getElementById('lastModified');
    if (lastModifiedEl) {
        const lastModified = new Date(document.lastModified);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        };
        lastModifiedEl.textContent = lastModified.toLocaleDateString('en-US', options);
    }
}

// ============================
// INITIALIZE ON PAGE LOAD
// ============================
document.addEventListener('DOMContentLoaded', () => {
    // Update footer on all pages
    updateFooter();

    // Set active page navigation - THIS FIXES NAVIGATION & WAYFINDING!
    setActivePage();

    // W04 Assignment Initialization (Runs on all pages, only executes on relevant one)
    setFormTimestamp();     
    displayThankYouData();  
    setupModals();          

    // Load directory members if on directory page
    if (memberDirectory) {
        loadMembers();
    }

    // Load weather and spotlights if on home page
    if (document.getElementById('currentTemp')) {
        fetchCurrentWeather();
        fetchWeatherForecast();
        loadSpotlights();
    }

    // W05: Load discover page content if on discover page
    if (document.getElementById('attractionsGrid')) {
        displayVisitMessage();
        loadAttractions();
    }

    // Lazy loading images
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
        img.addEventListener('load', () => {
            img.setAttribute('data-loaded', 'true');
        });
    });
});