const figure = document.querySelector(".world-network");
const stage = figure.querySelector(".global-stage");
const pointLayer = stage.querySelector(".world-points");
const card = figure.querySelector(".location-card");
const closeButton = card.querySelector(".location-close");
const memberList = card.querySelector(".location-members");
const choices = card.querySelector(".location-choices");
const directory = document.querySelector(".directory");
const directoryHash = "#directory-toggle";
function openLinkedDirectory() {
  if (window.location.hash === directoryHash) directory.open = true;
}
document.querySelectorAll('a[href="#directory-toggle"]').forEach(link => {
  link.addEventListener("click", () => { directory.open = true; });
});
window.addEventListener("hashchange", openLinkedDirectory);
openLinkedDirectory();
const roster = directory.querySelector(".roster");
const rows = Array.from(roster.children);
const search = directory.querySelector("input");
const status = directory.querySelector(".finder-status");
const clearSearch = directory.querySelector(".clear-search");
const points = Array.from(pointLayer.querySelectorAll(".place-dot"));
let active = null;
const rangeButtons = [...directory.querySelectorAll("[data-range]")];
const initials = rows.map(row => fold(row.querySelector(".person-name").textContent).split(/\s+/).at(-1)[0].toUpperCase());
let range = "AZ";
function chooseRange(value) {
  range = value;
  rangeButtons.forEach(button => button.setAttribute("aria-pressed", String(button.dataset.range === value)));
}

function fold(text) {
  return text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().trim();
}
const terms = rows.map(row => fold([row.querySelector(".person-name").textContent, row.dataset.institution, row.dataset.place].join(" ")));
function filterPeople() {
  const words = fold(search.value).split(/\s+/).filter(Boolean);
  let count = 0;
  rows.forEach((row, i) => {
    row.hidden = initials[i] < range[0] || initials[i] > range[1] || !words.every(word => terms[i].includes(word));
    if (!row.hidden) count++;
  });
  clearSearch.hidden = !search.value && range === "AZ";
  status.textContent = count ? count + (count === 1 ? " researcher" : " researchers") : "No matching researchers.";
  roster.scrollTop = 0;
}
directory.querySelector(".finder-tools").hidden = false;
search.addEventListener("input", () => { chooseRange("AZ"); filterPeople(); });
for (const button of rangeButtons) {
  button.addEventListener("click", () => { search.value = ""; chooseRange(button.dataset.range); filterPeople(); });
}
clearSearch.addEventListener("click", () => { search.value = ""; chooseRange("AZ"); filterPeople(); search.focus(); });
filterPeople();

const profiles = new Map(points.map(point => [
  point.dataset.city, rows.filter(row => row.dataset.place === point.dataset.city),
]));

function dismiss() {
  if (active) active.setAttribute("aria-expanded", "false");
  active = null;
  card.hidden = true;
  choices.hidden = true;
  choices.replaceChildren();
}

function show(point) {
  if (point === active) return;
  dismiss();
  active = point;
  point.setAttribute("aria-expanded", "true");
  const { city, country } = point.dataset;
  const members = profiles.get(city);
  card.querySelector("h3").textContent = city;
  card.querySelector(".location-meta").textContent = country + " · " + members.length +
    (members.length === 1 ? " researcher" : " researchers");
  memberList.replaceChildren(...members.map(row => {
    const item = row.cloneNode(true);
    item.hidden = false;
    return item;
  }));
  memberList.scrollTop = 0;
  memberList.hidden = false;
  card.querySelector(".location-meta").hidden = false;
  card.hidden = false;
}

function matchingPoints(event) {
  const touch = event.pointerType === "touch" || event.sourceCapabilities?.firesTouchEvents || lastPointerType === "touch";
  const radius = touch ? 18 : 12;
  const frame = mapWindow.getBoundingClientRect();
  const near = [];
  for (const point of points) {
    const box = point.getBoundingClientRect();
    const x = box.left + box.width / 2, y = box.top + box.height / 2;
    if (x < frame.left || x > frame.right || y < frame.top || y > frame.bottom) continue;
    const distance = Math.hypot(x - event.clientX, y - event.clientY);
    if (distance <= radius) near.push({ point, distance });
  }
  near.sort((a, b) => a.distance - b.distance);
  if (!touch || near.length < 2) return near.slice(0, 1).map(hit => hit.point);
  // Offer alternatives only if the tap is almost equally close to several dots.
  const best = near[0].distance;
  return near.filter(hit => hit.distance <= best + Math.min(3, best * .8 + .3)).map(hit => hit.point);
}

function offerChoices(matches) {
  dismiss();
  memberList.hidden = true;
  card.querySelector(".location-meta").hidden = true;
  card.querySelector("h3").textContent = "Choose a location";
  for (const point of matches) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = point.dataset.city;
    button.addEventListener("click", event => {
      show(point);
      if (event.detail === 0) closeButton.focus({ preventScroll: true });
    });
    choices.append(button);
  }
  choices.hidden = false;
  card.hidden = false;
  card.scrollIntoView({ block: "nearest", behavior: "instant" });
}

pointLayer.hidden = false;
figure.querySelector(".map-hint").hidden = false;
const mapWindow = figure.querySelector(".map-window");
const mapArt = stage.querySelector(".world-art");
const zoomIn = figure.querySelector(".zoom-in");
const zoomOut = figure.querySelector(".zoom-out");
const reset = figure.querySelector(".zoom-reset");
const ukPoint = points.find(point => point.dataset.city === "Manchester");
let zoom = 1;

const touchMap = window.matchMedia("(pointer: coarse)");
function zoomLimit() {
  const width = Math.max(1, mapWindow.clientWidth);
  // At this map width even London and Surrey are about 25 CSS pixels apart.
  if (touchMap.matches) return Math.max(1, 18000 / width);
  return Math.max(1, Math.min(8, 4600 / width));
}

function anchorAt(x, y) {
  const bounds = stage.getBoundingClientRect();
  return { x: (x - bounds.left) / bounds.width, y: (y - bounds.top) / bounds.height };
}

function placeAnchor(anchor, x, y, nextZoom) {
  if (!choices.hidden) dismiss();
  zoom = Math.max(1, Math.min(zoomLimit(), nextZoom));
  mapWindow.classList.toggle("enlarged", zoom > 1);
  stage.style.width = (zoom * 100) + "%";
  if (zoom > 1 && !mapArt.src.endsWith("network-detail.svg")) mapArt.src = "assets/map/network-detail.svg";
  const frame = mapWindow.getBoundingClientRect();
  mapWindow.scrollTo(anchor.x * stage.clientWidth - (x - frame.left),
                     anchor.y * stage.clientHeight - (y - frame.top));
  zoomOut.disabled = reset.disabled = zoom === 1;
  zoomIn.disabled = zoom >= zoomLimit();
}

function buttonZoom(factor) {
  const frame = mapWindow.getBoundingClientRect();
  let x = frame.left + frame.width / 2, y = frame.top + frame.height / 2;
  const point = active || ukPoint;
  if (point) {
    const pin = point.getBoundingClientRect();
    const px = pin.left + pin.width / 2, py = pin.top + pin.height / 2;
    if (px >= frame.left && px <= frame.right && py >= frame.top && py <= frame.bottom) {
      x = px;
      y = py;
    }
  }
  placeAnchor(anchorAt(x, y), x, y, zoom * factor);
}

function worldView() {
  dismiss();
  placeAnchor({ x: 0, y: 0 }, 0, 0, 1);
}
zoomIn.addEventListener("click", () => buttonZoom(1.6));
zoomOut.addEventListener("click", () => buttonZoom(1 / 1.6));
reset.addEventListener("click", worldView);

mapWindow.addEventListener("wheel", event => {
  if (!event.deltaY) return;
  const atLimit = event.deltaY < 0 ? zoom >= zoomLimit() : zoom === 1;
  if (atLimit && !event.ctrlKey) return;
  event.preventDefault();
  const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? mapWindow.clientHeight : 1;
  const rate = event.ctrlKey ? .012 : .0025;
  const delta = Math.max(-1, Math.min(1, -event.deltaY * unit * rate));
  placeAnchor(anchorAt(event.clientX, event.clientY), event.clientX, event.clientY, zoom * Math.exp(delta));
}, { passive: false });

// Leave a one-finger swipe to the browser. A two-finger gesture owns only the map.
let pinch = null;
function touchPair(touches) {
  const [a, b] = touches;
  return { x: (a.clientX + b.clientX) / 2, y: (a.clientY + b.clientY) / 2,
           distance: Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY) };
}
function startPinch(event) {
  if (event.touches.length !== 2) { pinch = null; return; }
  event.preventDefault();
  const pair = touchPair(event.touches);
  pinch = { anchor: anchorAt(pair.x, pair.y), distance: pair.distance, zoom };
}
mapWindow.addEventListener("touchstart", startPinch, { passive: false });
mapWindow.addEventListener("touchmove", event => {
  if (!pinch || event.touches.length !== 2) return;
  event.preventDefault();
  const pair = touchPair(event.touches);
  placeAnchor(pinch.anchor, pair.x, pair.y, pinch.zoom * pair.distance / Math.max(1, pinch.distance));
}, { passive: false });
mapWindow.addEventListener("touchend", startPinch, { passive: false });
mapWindow.addEventListener("touchcancel", () => { pinch = null; });
window.addEventListener("resize", () => buttonZoom(1));

// Touch and keyboard use native scrolling. Also allow grabbing the map with a mouse.
let drag = null;
let dragged = false;
let lastPointerType;
mapWindow.addEventListener("pointerdown", event => {
  dragged = false;
  lastPointerType = event.pointerType;
  if (zoom > 1 && event.pointerType === "mouse" && event.button === 0) {
    drag = { x: event.clientX, y: event.clientY, left: mapWindow.scrollLeft, top: mapWindow.scrollTop };
  }
});
mapWindow.addEventListener("pointermove", event => {
  if (!drag || !event.buttons) return;
  const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
  if (!dragged && Math.hypot(dx, dy) < 4) return;
  dragged = true;
  mapWindow.setPointerCapture(event.pointerId);
  mapWindow.classList.add("dragging");
  mapWindow.scrollTo(drag.left - dx, drag.top - dy);
});
function endDrag() {
  drag = null;
  mapWindow.classList.remove("dragging");
}
window.addEventListener("pointerup", endDrag);
mapWindow.addEventListener("pointercancel", endDrag);
mapArt.draggable = false;

function selectPoint(event) {
  const keyboard = event.detail === 0;
  if (dragged && !keyboard) return;
  const matches = keyboard ? [event.target.closest(".place-dot")] : matchingPoints(event);
  if (matches.length > 1) { offerChoices(matches); return; }
  const [point] = matches;
  if (!point || point === active) { dismiss(); return; }
  show(point);
  if (keyboard) closeButton.focus({ preventScroll: true });
}
pointLayer.addEventListener("click", selectPoint);
function closeFromCard() {
  const returnTo = active || points.find(point => point.dataset.city === choices.firstElementChild?.textContent);
  returnTo?.focus({ preventScroll: true });
  dismiss();
}
closeButton.addEventListener("click", closeFromCard);
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !card.hidden) {
    if (card.contains(document.activeElement)) closeFromCard();
    else dismiss();
  } else if (event.key === "Escape" && zoom > 1 && figure.contains(document.activeElement)) {
    worldView();
    zoomIn.focus({ preventScroll: true });
  }
});
for (const type of ["pointerdown", "focusin"]) {
  document.addEventListener(type, event => {
    if (!card.hidden && !figure.contains(event.target)) dismiss();
  });
}
