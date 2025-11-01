const menuButton = document.querySelector("#menu-toggle");
const nav = document.querySelector("#main-nav");

menuButton.addEventListener("click", () => {
  nav.classList.toggle("open");
  const expanded = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", !expanded);
});