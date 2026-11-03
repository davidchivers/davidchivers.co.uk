const chapterMenu = document.querySelector(".rail details");
if (chapterMenu) {
  const narrow = matchMedia("(max-width: 760px)");
  function setMenu() { chapterMenu.open = !narrow.matches; }
  setMenu();
  narrow.addEventListener("change", setMenu);
}

const fields = document.querySelectorAll(".answer textarea, .answer select, .answer input");
const prefix = "nicl/instructor/v1/" + document.body.dataset.chapter + "/";
const note = document.querySelector("[data-note]");
function storageUnavailable() {
  note.textContent = "Your browser cannot retain these answers. Print the guide before leaving this page to keep a copy.";
}
if (note) note.textContent = "Answers stay in this browser tab as you move between chapters. Print the guide to keep a copy.";
for (const field of fields) {
  const key = prefix + field.id;
  try { field.value = sessionStorage.getItem(key) || ""; }
  catch { storageUnavailable(); }
  const printText = field.parentElement.querySelector(".print-answer");
  printText.textContent = field.value;
  field.addEventListener("input", () => {
    printText.textContent = field.value;
    try {
      if (field.value) sessionStorage.setItem(key, field.value);
      else sessionStorage.removeItem(key);
    } catch { storageUnavailable(); }
  });
}
const printButton = document.querySelector("[data-print]");
if (printButton) printButton.addEventListener("click", () => window.print());
const outline = document.querySelector(".outline");
let outlineWasOpen;
window.addEventListener("beforeprint", () => {
  if (outline) { outlineWasOpen = outline.open; outline.open = true; }
});
window.addEventListener("afterprint", () => {
  if (outline) outline.open = outlineWasOpen;
});
