const puzzle = document.getElementById("puzzle");
let tiles = [];
let isLocked = false;

let affirmations = [];

fetch('affirmations.txt')
  .then(response => response.text())
  .then(data => {
    affirmations = [...data.matchAll(/"([^"]+)"/g)].map(match => match[1].trim());
  });

let audio = new Audio();
let currentSong = "";

function toggleMusicMenu() {
  const menu = document.getElementById("music-menu");
  const select = document.getElementById("music-select");
  menu.classList.toggle("hidden");
  select.options[0].disabled = true;
  select.options[0].style.display = "none"; 
}

function playSelectedSong() {
  const select = document.getElementById("music-select");
  const selected = select.value;
  select.options[0].disabled = true;
  select.options[0].style.display = "none"; 
  if (!selected) return;

  audio.src = selected;
  audio.loop = false;
  audio.play();
  currentSong = select.options[select.selectedIndex].text;

  document.getElementById("now-playing").textContent = `Now playing: ${currentSong}`;
}

function togglePlayPause() {
  const select = document.getElementById("music-select");
  select.options[0].disabled = true;
  select.options[0].style.display = "none"; 
  if (!audio.src) return;

  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function showAffirmation() {
  const box = document.getElementById("affirmation-box");
  const text = document.getElementById("affirmation-text");

  if (affirmations.length === 0) return;

  const randomIndex = Math.floor(Math.random() * affirmations.length);
  const randomAffirmation = affirmations[randomIndex];
  
  text.textContent = randomAffirmation;
  box.classList.add("show");
}

function createTiles() {
  tiles = [];
  for (let i = 1; i <= 15; i++) {
    tiles.push(i);
  }
  tiles.push(""); // empty space
}

function drawTiles() {
  puzzle.innerHTML = "";
  tiles.forEach((tile, index) => {
    const div = document.createElement("div");
    div.className = "tile";
    if (tile === "") div.classList.add("empty");
    div.textContent = tile;
    div.addEventListener("click", () => moveTile(index));
    puzzle.appendChild(div);
  });
}

function moveTile(index) {
  if (isLocked) return;

  const emptyIndex = tiles.indexOf("");
  const validMoves = [index - 1, index + 1, index - 4, index + 4];

  // prevent wraparound (left/right edge)
  if (index % 4 === 0 && emptyIndex === index - 1) return;
  if (index % 4 === 3 && emptyIndex === index + 1) return;

  if (validMoves.includes(emptyIndex)) {
    [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
    drawTiles();
    checkWin();
  }
}

function shuffle() {
  isLocked = false; 
  const box = document.getElementById("affirmation-box");
  box.classList.remove("show");

  do {
    createTiles();
    for (let i = tiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
    }
  } while (!isSolvable());
  drawTiles();
}

function isSolvable() {
  const flat = tiles.filter(n => n !== "");
  let inversions = 0;
  for (let i = 0; i < flat.length; i++) {
    for (let j = i + 1; j < flat.length; j++) {
      if (flat[i] > flat[j]) inversions++;
    }
  }

  const emptyIndex = tiles.indexOf("");
  const rowFromBottom = 4 - Math.floor(emptyIndex / 4); // 1-based from bottom

  // Correct condition for solvability:
  return (inversions + rowFromBottom) % 2 === 1;
}



function easyWin() {
  tiles = [...Array(15).keys()].map(x => x + 1).concat("");
  drawTiles();
  isLocked = true;
  setTimeout(() => {
    showAffirmation();
  }, 200);
}

const container = document.getElementById("star-container");

function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.left = Math.random() * 100 + "vw";
  const duration = Math.random() * 3 + 3;
  star.style.animationDuration = `${duration}s, 1s`;

  container.appendChild(star);

  setTimeout(() => star.remove(), duration * 1000);
}

setInterval(createStar, 300);


shuffle();
  
