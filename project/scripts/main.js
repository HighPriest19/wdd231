// Safer footer / year handling and page helpers
document.addEventListener("DOMContentLoaded", () => {
    const yearEl = document.getElementById("year");
    const altFooterP = document.querySelector("footer p");

    const year = new Date().getFullYear();
    if (yearEl) {
        yearEl.textContent = year;
    } else if (altFooterP) {
        altFooterP.innerHTML = `&copy; ${year} Hinckley Anime Reviews`;
    }

    const lastModEl = document.getElementById("last-modified");
    if (lastModEl) lastModEl.textContent = document.lastModified;
});

// Load Anime JSON into pages that have #anime-container
async function loadAnime() {
    const container = document.getElementById("anime-container");
    if (!container) return; // Page doesn't have anime grid

    try {
        // try the main file first, fall back to anime_fixed.json if needed
        let response = await fetch("data/anime.json");
        let data;
        try {
            data = await response.json();
        } catch (e) {
            // fallback
            const r2 = await fetch("data/anime_fixed.json");
            data = await r2.json();
        }
        const list = data.animes || [];

        list.forEach(anime => {
            const card = document.createElement("div");
            card.classList.add("anime-card");

            card.innerHTML = `
                <img src="${anime.image}" alt="${anime.title}">
                <h3>${anime.title}</h3>
                <p><strong>Year:</strong> ${anime.year}</p>
                <p><strong>Rating:</strong> ${anime.rating}</p>
            `;

            container.appendChild(card);
        });

    } catch (error) {
        console.error("Error loading anime.json:", error);
    }
}

// Load reviews JSON into pages that have #reviews-container
async function loadReviews() {
    const container = document.getElementById("reviews-container");
    if (!container) return;

    try {
        const response = await fetch("data/reviews.json");
        const data = await response.json();
        const list = data.reviews || [];

        if (list.length === 0) {
            container.innerHTML = '<p>No reviews yet. Be the first to add one!</p>';
            return;
        }

        list.forEach(r => {
            const card = document.createElement('article');
            card.className = 'review-card';
            card.innerHTML = `
                <h3>${r.title} <span class="rev-meta">— ${r.author} · ${r.date}</span></h3>
                <p class="rev-rating">Rating: <strong>${r.rating}</strong></p>
                <p>${r.content}</p>
            `;
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error loading reviews.json:', error);
        container.innerHTML = '<p>Error loading reviews.</p>';
    }
}

// Initialize loaders; each function checks for its target container
loadAnime();
loadReviews();