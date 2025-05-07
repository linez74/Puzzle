const puzzle = document.getElementById("puzzle");
let tiles = [];

const affirmations = [
  "You are exactly where you need to be today.",
  "You radiate kindness and attract joy effortlessly.",
  "Everything is unfolding for your highest good.",
  "You are loved, even on your hardest days.",
  "You have a soft heart and a strong mind—what a combo!"
];

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
    setTimeout(() => alert("You solved the puzzle!"), 200);
  }
}

function easyWin() {
  tiles = [...Array(15).keys()].map(x => x + 1).concat("");
  drawTiles();
}

shuffle();
