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
  menu.classList.toggle("hidden");
}

function playSelectedSong() {
  const select = document.getElementById("music-select");
  const selected = select.value;

  if (!selected) return;

  audio.src = selected;
  audio.loop = false;
  audio.play();
  currentSong = select.options[select.selectedIndex].text;

  document.getElementById("now-playing").textContent = `Now playing: ${currentSong}`;
}

function togglePlayPause() {
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
  const random = affirmations[Math.floor(Math.random() * affirmations.length)];
  text.textContent = random;
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
  // Hide affirmation box
  const box = document.getElementById("affirmation-box");
  box.classList.remove("show");

  do {
    createTiles();
    // Fisher-Yates shuffle
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
  const emptyRow = Math.floor(tiles.indexOf("") / 4);
  return (inversions + emptyRow) % 2 === 0;
}

function checkWin() {
  const win = [...Array(15).keys()].map(x => x + 1).concat("");
  if (tiles.every((val, i) => val === win[i])) {
    isLocked = true;
    setTimeout(() => {
  showAffirmation();
}, 200);
  }
}

function easyWin() {
  tiles = [...Array(15).keys()].map(x => x + 1).concat("");
  drawTiles();
  isLocked = true;
  setTimeout(() => {
    showAffirmation();
  }, 200);
}
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.animationDuration = 4 + Math.random() * 4 + "s";

  document.getElementById("heart-container").appendChild(heart);

  setTimeout(() => {
    heart.remove();
  }, 8000);
}

setInterval(createHeart, 800);

shuffle();
