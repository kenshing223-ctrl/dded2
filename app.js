const phases = [
  { name: "Inhale", className: "inhale", duration: 4000 },
  { name: "Hold", className: "hold", duration: 4000 },
  { name: "Exhale", className: "exhale", duration: 4000 },
];

const reflections = [
  '"Wherever you are, be there totally."',
  '"Feelings come and go like clouds in a windy sky."',
  '"Pause. Breathe. Begin again."',
  '"This moment is enough."',
  '"In stillness, we hear ourselves more clearly."',
];

const circle = document.getElementById("breathing-circle");
const breathingBtn = document.getElementById("breathing-btn");
const quote = document.getElementById("quote");
const quoteBtn = document.getElementById("quote-btn");
const gratitudeForm = document.getElementById("gratitude-form");
const gratitudeInput = document.getElementById("gratitude-input");
const gratitudeList = document.getElementById("gratitude-list");

let breathingActive = false;

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function runBreathingExercise() {
  breathingActive = true;
  breathingBtn.disabled = true;
  breathingBtn.textContent = "In progress...";

  for (let round = 0; round < 5; round += 1) {
    for (const phase of phases) {
      circle.className = `circle ${phase.className}`;
      circle.textContent = phase.name;
      await wait(phase.duration);
    }
  }

  circle.className = "circle";
  circle.textContent = "Complete";
  breathingBtn.disabled = false;
  breathingBtn.textContent = "Start 1-Minute Exercise";
  breathingActive = false;
}

function randomReflection() {
  const current = quote.textContent;
  let next = current;

  while (next === current) {
    next = reflections[Math.floor(Math.random() * reflections.length)];
  }

  quote.textContent = next;
}

function loadGratitudeList() {
  const items = JSON.parse(localStorage.getItem("gratitude-items") || "[]");
  gratitudeList.innerHTML = "";

  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    gratitudeList.append(li);
  }
}

function saveGratitudeItem(value) {
  const items = JSON.parse(localStorage.getItem("gratitude-items") || "[]");
  items.unshift(value);
  localStorage.setItem("gratitude-items", JSON.stringify(items.slice(0, 8)));
}

breathingBtn.addEventListener("click", () => {
  if (!breathingActive) {
    runBreathingExercise();
  }
});

quoteBtn.addEventListener("click", randomReflection);

gratitudeForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = gratitudeInput.value.trim();

  if (!value) {
    return;
  }

  saveGratitudeItem(value);
  gratitudeInput.value = "";
  loadGratitudeList();
});

loadGratitudeList();
