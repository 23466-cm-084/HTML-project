const places = [
  {
    id: "alpha",
    name: "Alpha Hotel",
    category: "food",
    categoryLabel: "SHAWARMA & GRILLS",
    specialty: "Chicken shawarma · the crowd favourite",
    area: "Gannavaram",
    distance: 4.2,
    price: "₹180",
    quote: "“Generous filling, warm bread, and so worth it.”",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?auto=format&fit=crop&w=900&q=82",
    alt: "Shawarma filled with grilled meat and fresh vegetables",
    helpful: 45,
    outcomes: 48,
    badge: "A local favourite"
  },
  {
    id: "pvp",
    name: "PVP Shawarma",
    category: "food",
    categoryLabel: "QUICK BITES",
    specialty: "Chicken rumali shawarma · easy on the wallet",
    area: "near PVP Square",
    distance: 2.8,
    price: "₹150",
    quote: "“A solid late-night pick when you want something filling.”",
    image: "https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=900&q=82",
    alt: "Freshly grilled wrap served with vegetables",
    helpful: 19,
    outcomes: 20,
    badge: "Great value"
  },
  {
    id: "bismillah",
    name: "Bismillah Shawarma",
    category: "food",
    categoryLabel: "SHAWARMA & GRILLS",
    specialty: "Spicy chicken shawarma · extra sauce",
    area: "Kalasrama Market",
    distance: 3.6,
    price: "₹170",
    quote: "“The spicy one has a proper kick. Ask for extra sauce.”",
    image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=900&q=82",
    alt: "Grilled food fresh from the barbecue",
    helpful: 11,
    outcomes: 12,
    badge: "Worth a try"
  },
  {
    id: "lenscare",
    name: "LensCare Optical",
    category: "shops",
    categoryLabel: "OPTICAL SHOP",
    specialty: "Everyday frames · helpful staff",
    area: "Benz Circle",
    distance: 3.1,
    price: "From ₹300",
    quote: "“Good everyday frames and patient help choosing them.”",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=82",
    alt: "Stylish optical glasses displayed on a counter",
    helpful: 23,
    outcomes: 25,
    badge: "People-approved"
  }
];

const resultsGrid = document.querySelector("#resultsGrid");
const emptyState = document.querySelector("#emptyState");
const queryInput = document.querySelector("#queryInput");
const locationInput = document.querySelector("#locationInput");
const radiusSelect = document.querySelector("#radiusSelect");
const resultsTitle = document.querySelector("#resultsTitle");
const resultsSubtitle = document.querySelector("#resultsSubtitle");
const feedbackDialog = document.querySelector("#feedbackDialog");
const dialogPlace = document.querySelector("#dialogPlace");
const toast = document.querySelector("#toast");
const menuToggle = document.querySelector("#menuToggle");
const mobileNav = document.querySelector("#mobileNav");

let activeCategory = "all";
let chosenPlaceId = null;
let toastTimer;

function getScore(place) {
  return Math.round(((place.helpful + 1) / (place.outcomes + 2)) * 100);
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

function getVisiblePlaces() {
  const query = queryInput.value.trim().toLowerCase();
  const radius = Number(radiusSelect.value);
  return places
    .filter(place => activeCategory === "all" || place.category === activeCategory)
    .filter(place => place.distance <= radius)
    .filter(place => {
      if (!query) return true;
      const searchable = `${place.name} ${place.categoryLabel} ${place.specialty} ${place.area} ${place.category}`.toLowerCase();
      return searchable.includes(query) || (query.includes("shawarma") && place.category === "food");
    })
    .sort((a, b) => getScore(b) - getScore(a));
}

function renderCard(place, index) {
  const saved = place.saved ? "true" : "false";
  const score = getScore(place);
  return `
    <article class="place-card" data-place-id="${place.id}">
      <div class="card-image-wrap">
        <img class="card-image" src="${place.image}" alt="${escapeHTML(place.alt)}" loading="lazy" />
        <span class="card-rank"><span>✳</span> ${escapeHTML(place.badge)}</span>
        <button class="save-button" type="button" data-save="${place.id}" aria-label="Save ${escapeHTML(place.name)}" aria-pressed="${saved}">${place.saved ? "♥" : "♡"}</button>
      </div>
      <div class="card-body">
        <div class="card-kicker"><span class="card-category">${escapeHTML(place.categoryLabel)}</span><span>№ 0${index + 1}</span></div>
        <div class="place-name-line"><h3 class="place-name">${escapeHTML(place.name)}</h3><span class="place-price">${escapeHTML(place.price)} avg.</span></div>
        <p class="place-specialty">${escapeHTML(place.specialty)}</p>
        <p class="place-location"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 10.2c0 5.1-7 11-7 11s-7-5.9-7-11a7 7 0 1 1 14 0Z"></path><circle cx="12" cy="10" r="2.2"></circle></svg>${escapeHTML(place.area)} <span>·</span> ${place.distance.toFixed(1)} km away</p>
        <p class="place-quote">${escapeHTML(place.quote)}</p>
        <div class="trust-row">
          <div class="trust-info">
            <div class="trust-ring" style="--score:${score}" aria-label="${score} percent helpful"><span>${score}</span></div>
            <div class="trust-copy"><strong>Helpful recs</strong><span>${place.helpful} of ${place.outcomes} follow-ups</span></div>
          </div>
          <button class="try-button" type="button" data-try="${place.id}">I tried this <span aria-hidden="true">↗</span></button>
        </div>
      </div>
    </article>`;
}

function updateHeading(count) {
  const query = queryInput.value.trim();
  const location = locationInput.value.trim() || "near you";
  if (query) {
    resultsTitle.innerHTML = `${escapeHTML(query.charAt(0).toUpperCase() + query.slice(1))} spots worth <em>knowing.</em>`;
  } else if (activeCategory === "shops") {
    resultsTitle.innerHTML = `Local shops worth <em>knowing.</em>`;
  } else {
    resultsTitle.innerHTML = `Good local picks, <em>passed along.</em>`;
  }
  resultsSubtitle.textContent = count
    ? `A few lovely leads around ${location}, picked by people who’ve been.`
    : `We couldn’t find a match around ${location} just yet.`;
}

function render() {
  const visible = getVisiblePlaces();
  resultsGrid.innerHTML = visible.map(renderCard).join("");
  resultsGrid.hidden = visible.length === 0;
  emptyState.hidden = visible.length !== 0;
  updateHeading(visible.length);
  document.querySelectorAll(".category-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.category === activeCategory);
  });
  const allPicksTab = document.querySelector('[data-category="all"] .tab-count');
  if (allPicksTab) allPicksTab.textContent = String(visible.length).padStart(2, "0");
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove("visible"), 2600);
}

document.querySelector("#searchForm").addEventListener("submit", event => {
  event.preventDefault();
  activeCategory = "all";
  render();
  document.querySelector("#discover").scrollIntoView({ behavior: "smooth", block: "start" });
});

radiusSelect.addEventListener("change", render);

document.querySelectorAll(".category-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    activeCategory = tab.dataset.category;
    queryInput.value = "";
    render();
  });
});

document.querySelector("#clearSearch").addEventListener("click", () => {
  queryInput.value = "";
  radiusSelect.value = "20";
  activeCategory = "all";
  render();
});

resultsGrid.addEventListener("click", event => {
  const saveButton = event.target.closest("[data-save]");
  if (saveButton) {
    const place = places.find(item => item.id === saveButton.dataset.save);
    place.saved = !place.saved;
    render();
    showToast(place.saved ? `${place.name} is saved for later.` : `${place.name} removed from your saved picks.`);
    return;
  }

  const tryButton = event.target.closest("[data-try]");
  if (tryButton) {
    const place = places.find(item => item.id === tryButton.dataset.try);
    chosenPlaceId = place.id;
    dialogPlace.textContent = `Did you try ${place.name}?`;
    feedbackDialog.showModal();
  }
});

document.querySelectorAll(".feedback-options button").forEach(button => {
  button.addEventListener("click", () => {
    const place = places.find(item => item.id === chosenPlaceId);
    if (!place) return;
    place.outcomes += 1;
    if (button.dataset.rating === "loved") place.helpful += 1;
    feedbackDialog.close();
    render();
    showToast("Thanks for sharing how it went. That helps the next person.");
    chosenPlaceId = null;
  });
});

document.querySelector("#notVisited").addEventListener("click", () => {
  feedbackDialog.close();
  showToast("No worries — your score stays the same until you’ve tried it.");
  chosenPlaceId = null;
});

document.querySelector("#dialogClose").addEventListener("click", () => feedbackDialog.close());
feedbackDialog.addEventListener("click", event => {
  if (event.target === feedbackDialog) feedbackDialog.close();
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
  mobileNav.classList.toggle("open", !isOpen);
});

mobileNav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    mobileNav.classList.remove("open");
  });
});

render();
