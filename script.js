// --- Date Display ---
function updateDate() {
  const now = new Date()

  const weekday = now.toLocaleDateString(undefined, { weekday: "long" })
  const month = now.toLocaleDateString(undefined, { month: "long" })
  const day = now.getDate()

  document.getElementById("dateDisplay").textContent = `${weekday}, ${month} ${day}`
}
updateDate()

// --- Google Search ---
document.getElementById("searchInput").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const query = e.target.value
    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    e.target.value = "";
  }
})

// --- Categories ---
// Constants
const NAME_KEY = "categoryNames";
const LINK_KEY = "links";

// Show inline form on '+' click
document.querySelectorAll(".add-link-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".category-card");
    const form = card.querySelector(".inline-form");

    // Toggle form visibility
    const isHidden = form.classList.contains("hidden");
    form.classList.toggle("hidden");

    // Change button text
    btn.textContent = isHidden ? "–" : "+";
  });
});

// Handle inline add for each category
document.querySelectorAll(".inline-add-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const card = btn.closest(".category-card");
    const id = card.getAttribute("data-id");
    const nameInput = card.querySelector(".inline-link-name");
    const urlInput = card.querySelector(".inline-link-url");

    const name = nameInput.value.trim();
    const url = urlInput.value.trim();
    if (!name || !url) return;

    const storedLinks = JSON.parse(localStorage.getItem(LINK_KEY) || "{}");
    if (!storedLinks[id]) storedLinks[id] = [];
    storedLinks[id].push({ name, url });
    localStorage.setItem(LINK_KEY, JSON.stringify(storedLinks));

    // Reset fields and hide form
    nameInput.value = "";
    urlInput.value = "";
    card.querySelector(".inline-form").classList.add("hidden");

    // 🔁 Reset toggle icon
    const toggleBtn = card.querySelector(".add-link-btn");
    toggleBtn.textContent = "+";

    renderLinks();
  });
});

// Save renamed category names
document.querySelectorAll(".category-name").forEach((input) => {
  input.addEventListener("input", () => {
    const card = input.closest(".category-card");
    const id = card.getAttribute("data-id");

    const storedNames = JSON.parse(localStorage.getItem(NAME_KEY) || "{}");
    storedNames[id] = input.value;
    localStorage.setItem(NAME_KEY, JSON.stringify(storedNames));
  });
});

// Restore category names
function restoreCategoryNames() {
  const storedNames = JSON.parse(localStorage.getItem(NAME_KEY) || "{}");

  document.querySelectorAll(".category-card").forEach((card) => {
    const id = card.getAttribute("data-id");
    const input = card.querySelector(".category-name");
    if (storedNames[id]) {
      input.value = storedNames[id];
    }
  });
}

// Render links
function renderLinks() {
  const storedLinks = JSON.parse(localStorage.getItem(LINK_KEY) || "{}");

  document.querySelectorAll(".category-card").forEach((card) => {
    const id = card.getAttribute("data-id");
    const list = card.querySelector(".link-list");
    list.innerHTML = "";

    const links = storedLinks[id] || [];
    links.forEach((link) => {
      const li = document.createElement("li");
      li.textContent = link.name;
      li.onclick = () => window.location.href = link.url;
      list.appendChild(li);
    });
  });
}

const menu = document.getElementById("customMenu");
let currentLink = null;

// Right-click on a link to show custom menu
document.querySelectorAll(".link-list").forEach((list) => {
  list.addEventListener("contextmenu", (e) => {
    if (e.target.tagName.toLowerCase() === "li") {
      e.preventDefault();
      currentLink = e.target;

      // Show menu at cursor
      menu.style.top = `${e.pageY}px`;
      menu.style.left = `${e.pageX}px`;
      menu.classList.remove("hidden");
    }
  });
});

// Hide menu on left click
document.addEventListener("click", () => {
  menu.classList.add("hidden");
});

// Copy URL of clicked link
document.getElementById("copyUrl").addEventListener("click", () => {
  const url = getLinkURL(currentLink);
  if (url) {
    navigator.clipboard.writeText(url);
  }
  menu.classList.add("hidden");
});

// Delete clicked link
document.getElementById("deleteLink").addEventListener("click", () => {
  const card = currentLink.closest(".category-card");
  const id = card.getAttribute("data-id");
  const text = currentLink.textContent;

  const storedLinks = JSON.parse(localStorage.getItem("links") || "{}");
  if (storedLinks[id]) {
    storedLinks[id] = storedLinks[id].filter(l => l.name !== text);
    localStorage.setItem("links", JSON.stringify(storedLinks));
  }

  currentLink.remove();
  menu.classList.add("hidden");
});

// Get URL from localStorage using link name and category ID
function getLinkURL(linkElement) {
  const card = linkElement.closest(".category-card");
  const id = card.getAttribute("data-id");
  const text = linkElement.textContent;

  const storedLinks = JSON.parse(localStorage.getItem("links") || "{}");
  const match = storedLinks[id]?.find(l => l.name === text);
  return match?.url || null;
}

const toggleButton = document.getElementById("themeToggle");
const sunIcon = document.getElementById("sunIcon");
const moonIcon = document.getElementById("moonIcon");

const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
let currentTheme = localStorage.getItem("theme") || (prefersDark ? "dark" : "light");
applyTheme(currentTheme);

toggleButton.addEventListener("click", () => {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme(currentTheme);
  localStorage.setItem("theme", currentTheme);
});

function applyTheme(theme) {
  document.body.classList.toggle("dark-mode", theme === "dark");

  if (theme === "dark") {
    sunIcon.classList.remove("hidden");
    moonIcon.classList.add("hidden");
  } else {
    sunIcon.classList.add("hidden");
    moonIcon.classList.remove("hidden");
  }
}

// Init
window.onload = () => {
  restoreCategoryNames();
  renderLinks();
};



