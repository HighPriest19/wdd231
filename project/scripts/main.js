const cardsContainer = document.querySelector(".cards");
const searchInput = document.getElementById("search");
const genreSelect = document.getElementById("genre");
let animeData = [];

// Fetch JSON data
fetch("data/anime.json")
  .then(res => res.json())
  .then(data => {
    animeData = data;
    displayCards(animeData);
  });

function displayCards(data) {
  cardsContainer.innerHTML = "";
  data.forEach(anime => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <img src="${anime.poster}" alt="${anime.title}" class="poster">
      <h3>${anime.title}</h3>
      <p>Genre: ${anime.genre}</p>
      <p>Rating: ${anime.rating}</p>
      <p>Year: ${anime.year}</p>
    `;
    cardsContainer.appendChild(card);
  });
}

// Filter functionality
searchInput.addEventListener("input", () => {
  const filtered = animeData.filter(a =>
    a.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (genreSelect.value === "All" || a.genre === genreSelect.value)
  );
  displayCards(filtered);
});

genreSelect.addEventListener("change", () => {
  const filtered = animeData.filter(a =>
    a.title.toLowerCase().includes(searchInput.value.toLowerCase()) &&
    (genreSelect.value === "All" || a.genre === genreSelect.value)
  );
  displayCards(filtered);
});

// Simple carousel auto-slide
let currentIndex = 0;
const slides = document.querySelectorAll(".carousel img");
setInterval(() => {
  slides[currentIndex].classList.remove("active");
  currentIndex = (currentIndex + 1) % slides.length;
  slides[currentIndex].classList.add("active");
}, 4000);