/* =====================================================================
   main.js — builds the page from DATA (data.js) and adds interactions.
   Sections: helpers → render → smooth scroll → projects list →
             project page (+ slider) → theme → menu → palette →
             fade-in → clock
   ===================================================================== */

/* ===== HELPERS ===== */

// Shortcut for document.getElementById
const $ = (id) => document.getElementById(id);

// Map an array to HTML strings and join them
const renderList = (items, template) => items.map(template).join("");

// Placeholder portrait (dotted silhouette), shown when no photo is set
const SILHOUETTE = `<svg viewBox="0 0 300 400" role="img" aria-label="Portrait placeholder"><defs><pattern id="h" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.6" fill="currentColor"/></pattern></defs><g style="color:var(--fg)"><circle cx="150" cy="130" r="62" fill="url(#h)"/><path d="M30 400c4-90 40-150 120-150s116 60 120 150z" fill="url(#h)" opacity=".8"/></g></svg>`;

// Returns an <img> if a photo path exists, otherwise the silhouette
const photo = (src, alt) =>
  src ? `<img src="${src}" alt="${alt}">` : SILHOUETTE;

// Reusable pieces of markup
const tagList = (tags) => tags.map((t) => `<span>${t}</span>`).join("");
const listRow = (href, left, right) =>
  `<a href="${href}"><span>${left}</span><span class="mono">${right}</span></a>`;

const root = document.documentElement;
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ===== RENDER: fill the empty containers in index.html ===== */

/* Hero */
$("photo").innerHTML = photo(DATA.photo, `${DATA.name} portrait`);
$("name").textContent = DATA.name;
$("bio").textContent = DATA.bio;

/* Hero: communities (text logos) */
$("orgs").innerHTML = renderList(
  DATA.communities,
  (name) => `<div><b>${name}</b><span class="micro">Community</span></div>`,
);

/* Social links: same markup in the hero and the footer */
const socialLinks = renderList(
  DATA.social,
  ([name, url]) =>
    `<a class="ul" href="${url}" target="_blank" rel="noopener">${name} ↗</a>`,
);
$("links").innerHTML = socialLinks;
$("flinks").innerHTML = socialLinks;

/* Email: sidebar + footer, both as mailto links */
["mail", "sidemail"].forEach((id) => {
  $(id).textContent = DATA.email;
  $(id).href = `mailto:${DATA.email}`;
});

/* "All posts" points to the Substack link (found by name, not position) */
const substack = DATA.social.find(([name]) => name === "substack");
if (substack) $("allposts").href = substack[1];

/* Stack: one group per category */
$("stackg").innerHTML = renderList(
  Object.entries(DATA.stack),
  ([category, tools]) =>
    `<div><div class="micro">${category}</div><div class="tags">${tagList(tools)}</div></div>`,
);

/* Certifications and posts share the same row layout */
$("certl").innerHTML = renderList(DATA.certs, (c) =>
  listRow(c.url, c.name, c.meta),
);
$("postl").innerHTML = renderList(DATA.posts, (p) =>
  listRow(p.url, p.title, p.date),
);

/* ===== SMOOTH SCROLL (Lenis, bundled as lenis.min.js) =====
   Lenis eases the page scroll for wheel/trackpad. Skipped if the visitor
   prefers reduced motion, or if the file failed to load (page still works). */
const lenis =
  window.Lenis && !reduceMotion
    ? new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // ease-out expo
        autoRaf: true,
      })
    : null;

// Smoothly scroll to an element (with or without Lenis)
const scrollToEl = (el) =>
  lenis
    ? lenis.scrollTo(el, { offset: -24 })
    : el.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });

// Go to a section: update the URL, close the project page if open, then scroll
function scrollToSection(id) {
  history.pushState(null, "", `#${id}`);
  route();
  requestAnimationFrame(() => scrollToEl($(id)));
}

/* One click handler for every "#..." link on the page */
let cameFromCard = false; // true if the project page was opened by clicking a card
document.addEventListener("click", (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const id = link.getAttribute("href").slice(1);

  if (!id) return e.preventDefault(); // placeholder link (href="#"): do nothing
  if ($(id)) {
    // a real section → smooth scroll
    e.preventDefault();
    scrollToSection(id);
    return;
  }
  // otherwise it's a project link (#project-3): let the URL change, route() opens it
  if (link.classList.contains("card")) cameFromCard = true;
});

/* ===== PROJECTS LIST: 3 equal cards + "See all" toggle ===== */
const FEATURED_COUNT = 3; // how many projects show before "See all"
let showAll = false;

/* Card hover glow: while the mouse is over a card, a blurred gradient orb
   (.card::before in styles.css) eases toward the cursor. --mx / --my are the
   orb's position inside the card; the fade in/out itself is done in CSS. */
function bindCardGlow(card) {
  let x = 0,
    y = 0; // current orb position
  let mouseX = 0,
    mouseY = 0; // last cursor position on screen
  let frame = null;

  // cursor position relative to the card (re-read each frame, so it also follows page scrolling)
  const target = () => {
    const r = card.getBoundingClientRect();
    return [mouseX - r.left, mouseY - r.top];
  };
  const paint = () => {
    card.style.setProperty("--mx", `${x}px`);
    card.style.setProperty("--my", `${y}px`);
  };
  const tick = () => {
    const [tx, ty] = target();
    const ease = reduceMotion ? 1 : 0.12; // lower = floatier
    x += (tx - x) * ease;
    y += (ty - y) * ease;
    paint();
    frame = requestAnimationFrame(tick);
  };

  card.addEventListener("pointerenter", (e) => {
    if (e.pointerType !== "mouse") return; // touch has no hover
    mouseX = e.clientX;
    mouseY = e.clientY;
    [x, y] = target(); // appear right under the cursor, then follow
    paint();
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(tick);
  });
  card.addEventListener("pointermove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  card.addEventListener("pointerleave", () => {
    cancelAnimationFrame(frame); // stop following; the orb just fades out where it is
    frame = null;
  });
}

// One card. Clicking it opens that project's page (#project-<index>)
const projectCard = (p, i) => {
  const number = String(i + 1).padStart(2, "0");
  const pill = p.status ? `<span class="pill">${p.status}</span>` : "";
  const preview =
    p.images && p.images.length
      ? `<div class="pv"><img src="${p.images[0]}" alt="" loading="lazy"></div>`
      : `<div class="pv"></div>`;
  return `<a class="card" href="#project-${i}"><div class="cardtop"><span class="micro">${number}</span>${pill}</div>${preview}<h3>${p.title}</h3><p>${p.desc}</p></a>`;
};

function renderProjects() {
  const visible = showAll
    ? DATA.projects
    : DATA.projects.slice(0, FEATURED_COUNT);
  // keep each card's real index (so #project-<i> points to the right project)
  $("bento").innerHTML = visible
    .map((p) => projectCard(p, DATA.projects.indexOf(p)))
    .join("");
  $("bento").querySelectorAll(".card").forEach(bindCardGlow);

  const button = $("seeall");
  button.hidden = DATA.projects.length <= FEATURED_COUNT; // nothing to expand
  button.textContent = showAll
    ? "Show less −"
    : `See all projects (${DATA.projects.length}) +`;
  button.setAttribute("aria-expanded", showAll);
}
$("seeall").onclick = () => {
  showAll = !showAll;
  renderProjects();
};
renderProjects();

/* ===== PROJECT PAGE ===== */
const projectPage = $("project");
const PLACEHOLDER_SLIDES = 3; // placeholder slides shown until you add images
const SLIDE_MS = 3500; // time each slide stays
let sliderTimer = null;

/* Vertical auto-slider. Slides stack in a column; the column moves up one
   slide at a time. A copy of the first slide sits at the end so the loop
   restarts without a visible jump back. */
function buildSlider(images, title) {
  const box = $("pslider");
  const slides = images.length
    ? images.map(
        (src, i) =>
          `<div class="slide"><img src="${src}" alt="${title} screenshot ${i + 1}"></div>`,
      )
    : Array.from(
        { length: PLACEHOLDER_SLIDES },
        (_, i) => `<div class="slide ph">project picture ${i + 1}</div>`,
      );
  const n = slides.length;
  const all = n > 1 ? [...slides, slides[0]] : slides; // + clone of first

  const dots =
    n > 1
      ? `<div class="dots">${slides
          .map(
            (_, i) =>
              `<button data-i="${i}" aria-label="Show image ${i + 1}"></button>`,
          )
          .join("")}</div>`
      : "";
  box.innerHTML = `<div class="track">${all.join("")}</div>${dots}`;
  if (n < 2) return; // a single image doesn't need to move

  const track = box.querySelector(".track");
  const dotEls = [...box.querySelectorAll(".dots button")];
  let idx = 0;

  const show = () => {
    track.style.transform = `translateY(${-idx * 100}%)`;
    dotEls.forEach((d, i) => d.classList.toggle("on", i === idx % n));
  };
  const next = () => {
    idx++;
    show();
  };
  const play = () => {
    stopSlider();
    if (!reduceMotion) sliderTimer = setInterval(next, SLIDE_MS);
  };

  // After sliding onto the clone, jump back to the real first slide (no animation)
  track.addEventListener("transitionend", (e) => {
    if (e.target !== track || idx < n) return;
    track.classList.add("snap");
    idx = 0;
    show();
    track.offsetHeight; // force the browser to apply it before re-enabling the animation
    track.classList.remove("snap");
  });

  box.onmouseenter = stopSlider; // pause while hovering
  box.onmouseleave = play;
  box.onclick = (e) => {
    const dot = e.target.closest("button[data-i]");
    if (!dot || idx >= n) return;
    idx = +dot.dataset.i;
    show();
    play();
  };

  show();
  play();
}

function stopSlider() {
  clearInterval(sliderTimer);
  sliderTimer = null;
}

function openProject(i) {
  const p = DATA.projects[i];
  const number = String(i + 1).padStart(2, "0");
  const pill = p.status ? `<span class="pill">${p.status}</span>` : "";

  $("pmeta").innerHTML = `<span>${number} — project</span>${pill}`;
  $("ptitle").textContent = p.title;
  $("pdesc").textContent = p.about || p.desc;

  // Optional "View project" link (hidden when url is "#" or empty)
  const hasLink = p.url && p.url !== "#";
  $("plink").hidden = !hasLink;
  if (hasLink) $("plink").href = p.url;

  // Tech stack (from p.stack in data.js). Faded placeholders until you add it
  $("pstack").innerHTML =
    p.stack && p.stack.length
      ? tagList(p.stack)
      : `<span class="ghost">Tool</span><span class="ghost">Tool</span><span class="ghost">Tool</span>`;

  buildSlider(p.images || [], p.title);

  projectPage.hidden = false;
  projectPage.scrollTop = 0;
  root.classList.add("no-scroll"); // lock the page behind
  $("pback").focus({ preventScroll: true });
}

function closeProject() {
  if (projectPage.hidden) return;
  stopSlider();
  $("pslider").innerHTML = "";
  projectPage.hidden = true;
  root.classList.remove("no-scroll");
}

// Leave the project page: go back in history if we came from a card, else go to #projects
function leaveProject() {
  if (cameFromCard) {
    cameFromCard = false;
    history.back();
  } else {
    history.replaceState(null, "", "#projects");
    route();
  }
}
$("pback").onclick = leaveProject;

/* Router: the URL hash decides if a project page is open (#project-0, #project-1, ...) */
function route() {
  const match = location.hash.match(/^#project-(\d+)$/);
  const index = match ? Number(match[1]) : -1;
  if (DATA.projects[index]) openProject(index);
  else closeProject();
}
addEventListener("hashchange", route);
route(); // handle a page load that already has #project-N in the URL

/* ===== THEME TOGGLE ===== */
$("theme").onclick = () => {
  const isLight = getComputedStyle(root).colorScheme === "light";
  root.dataset.theme = isLight ? "dark" : "light"; // triggers the matching CSS block
};

/* ===== MOBILE MENU ===== */
const sidebar = $("side");
const burger = $("burger");

burger.onclick = () => {
  const isOpen = sidebar.classList.toggle("open");
  burger.setAttribute("aria-expanded", isOpen);
};
// Close the sidebar after tapping any link inside it
sidebar.addEventListener("click", (e) => {
  if (e.target.closest("a")) sidebar.classList.remove("open");
});

/* ===== COMMAND PALETTE (Ctrl/Cmd + K) ===== */
const palette = $("pal");

// [label, section id] pairs
const SECTIONS = [
  ["Home", "home"],
  ["Projects", "projects"],
  ["Stack", "stack"],
  ["Certifications", "certs"],
  ["Writing", "writing"],
  ["Contact", "contact"],
];

$("palin").innerHTML = renderList(
  SECTIONS,
  ([label, id]) => `<button data-id="${id}">${label}</button>`,
);

const openPalette = () => {
  palette.classList.add("on");
  palette.querySelector("button").focus();
};
const closePalette = () => palette.classList.remove("on");

$("kbd").onclick = openPalette;

// Clicking a button scrolls to its section; clicking the backdrop just closes
palette.addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (button) scrollToSection(button.dataset.id);
  if (button || e.target === palette) closePalette();
});

// Keyboard: Ctrl/Cmd+K toggles the palette, Escape closes palette / project page
addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    palette.classList.contains("on") ? closePalette() : openPalette();
  }
  if (e.key === "Escape") {
    if (palette.classList.contains("on")) closePalette();
    else if (!projectPage.hidden) leaveProject();
  }
});

/* ===== FADE-IN ON SCROLL ===== */
// Adds "in" the first time an element is 15% visible: .rv fades in; section heads
// and the footer draw their gradient line (see .sec-head in styles.css)
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("in");
      revealObserver.unobserve(entry.target);
    }),
  { threshold: 0.15 },
);
document
  .querySelectorAll(".rv, .sec-head, footer")
  .forEach((el) => revealObserver.observe(el));

/* ===== FOOTER CLOCK (Manila time) ===== */
function updateClock() {
  const time = new Date().toLocaleTimeString("en-GB", {
    timeZone: "Asia/Manila",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  $("clock").textContent = `Manila ${time}`;
}
updateClock();
setInterval(updateClock, 1000);
