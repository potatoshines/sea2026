/**
 * Data Catalog Project Starter Code - SEA Stage 2
 *
 * This file is where you should be doing most of your work. You should
 * also make changes to the HTML and CSS files, but we want you to prioritize
 * demonstrating your understanding of data structures, and you'll do that
 * with the JavaScript code you write in this file.
 *
 * The comments in this file are only to help you learn how the starter code
 * works. The instructions for the project are in the README. That said, here
 * are the three things you should do first to learn about the starter code:
 * - 1 - Change something small in index.html or style.css, then reload your
 *    browser and make sure you can see that change.
 * - 2 - On your browser, right click anywhere on the page and select
 *    "Inspect" to open the browser developer tools. Then, go to the "console"
 *    tab in the new window that opened up. This console is where you will see
 *    JavaScript errors and logs, which is extremely helpful for debugging.
 *    (These instructions assume you're using Chrome, opening developer tools
 *    may be different on other browsers. We suggest using Chrome.)
 * - 3 - Add another string to the titles array a few lines down. Reload your
 *    browser and observe what happens. You should see a fourth "card" appear
 *    with the string you added to the array, but a broken image.
 *
 */

let selectedCity = "All";
let selectedCrowd = "All";
let selectedSort = "none";
let showBookmarksOnly = false;
let searchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
  setupFilters();
  setupControls();
  applyFilters();
});

// CARDS
function showCards(data) {
  const container = document.getElementById("card-container");
  container.innerHTML = "";
  const template = document.getElementById("template-card");

  // for each location, we will update the card.
  data.forEach((loc) => {
    const card = template.cloneNode(true);
    card.style.display = "block";

    card.querySelector("h2").textContent = loc.name;
    card.querySelector(".city").textContent = "City: " + loc.city;
    card.querySelector(".crowd").textContent = "Crowd: " + loc.crowdLevel;
    card.querySelector(".rating-public").textContent =
      "Public Rating: " + loc.publicRating;

    const img = card.querySelector(".card-img");

    // uses default if no image
    img.src = `images/${loc.city.toLowerCase()}/${loc.city.toLowerCase()}.png`;
    // img.src = loc.publicImage; // use this for when we have actual images

    if (loc.userImages && loc.userImages.length > 0) {
      img.src = loc.userImages[loc.userImages.length - 1];
    }

    // when user uploads an image of their own
    const fileInput = card.querySelector(".upload-input");

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();

      reader.onload = (event) => {
        const imgSrc = event.target.result;
        loc.userImages.push(imgSrc);
        img.src = imgSrc;
      };

      reader.readAsDataURL(file);
    };

    // bookmark button that users select
    const bookmarkBtn = card.querySelector(".bookmark-btn");
    bookmarkBtn.classList.toggle("active", !!loc.isStarred);

    bookmarkBtn.onclick = () => {
      loc.isStarred = !loc.isStarred;
      applyFilters();
    };

    // for rating purposes
    createStars(card, loc);
    container.appendChild(card);
  });
}

// FILTER Logic
function applyFilters() {
  let result = locations.filter((loc) => {
    return (
      (selectedCity === "All" || loc.city === selectedCity) &&
      (selectedCrowd === "All" || loc.crowdLevel === selectedCrowd) &&
      (!showBookmarksOnly || loc.isStarred) &&
      loc.name.toLowerCase().includes(searchQuery)
    );
  });

  // sort by public rating
  if (selectedSort === "public") {
    result.sort((a, b) => b.publicRating - a.publicRating);
  }

  // sort by user rating
  if (selectedSort === "user") {
    result.sort((a, b) => (b.userRating || 0) - (a.userRating || 0));
  }

  // sort by the name (alphabetically)
  if (selectedSort === "name") {
    result.sort((a, b) => a.name.localeCompare(b.name));
  }

  showCards(result);
}

// CONTROLS SET UP (sort, search, bookmark, filter buttons)
function setupControls() {
  document.getElementById("sort-select").onchange = (e) => {
    selectedSort = e.target.value;
    applyFilters();
  };

  document.getElementById("search").oninput = (e) => {
    searchQuery = e.target.value.toLowerCase();
    applyFilters();
  };

  document.getElementById("bookmark-view-btn").onclick = () => {
    showBookmarksOnly = !showBookmarksOnly;
    applyFilters();
  };

  document.getElementById("toggle-filters").onclick = () => {
    document.getElementById("filter-panel").classList.toggle("hidden");
  };
}

// FILTERS SET UP (city and crowd, as a part of filter)
function setupFilters() {
  document.querySelectorAll(".city-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".city-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCity = btn.dataset.city;
      applyFilters();
    };
  });

  document.querySelectorAll(".crowd-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".crowd-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedCrowd = btn.dataset.crowd;
      applyFilters();
    };
  });
}

// a function for creating stars for rating
function createStars(card, loc) {
  const starsContainer = card.querySelector(".stars");
  starsContainer.innerHTML = "";

  for (let i = 1; i < 6; i++) {
    const star = document.createElement("span");
    star.textContent = "★";

    if (i <= loc.userRating) star.classList.add("active");

    star.onclick = () => {
      loc.userRating = i;
      applyFilters();
    };

    starsContainer.appendChild(star);
  }

  card.querySelector(".rating-number").textContent = loc.userRating ? loc.userRating.toFixed(1) : loc.publicRating;
}