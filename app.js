const pairs = [
  { text: "Happy", emoji: "😄" },
  { text: "Sad", emoji: "😞" },
  { text: "Angry", emoji: "😠" },
  { text: "Hot", emoji: "🥵" },
  { text: "Cold", emoji: "🥶" },
  { text: "Sleepy", emoji: "😪" },
];

const newGame = document.getElementById("newGame");
const boardContainer = document.getElementById("board");
const moveCounter = document.getElementById("moves");
const pairsCounter = document.getElementById("pairs");
const gameArea = document.getElementById("gameArea");

let deck = [];
let clickedCards = [];
let moves = 0;
let matchedPairs = 0;
let isLocked = false;

newGame.addEventListener("click", () => {
  gameArea.style.display = "flex";
  startGame();
});

function startGame() {
  boardContainer.innerHTML = "";
  deck = [];
  clickedCards = [];
  moves = 0;
  matchedPairs = 0;
  isLocked = false;
  moveCounter.textContent = `Moves: ${moves}`;
  pairsCounter.textContent = `Pairs: ${matchedPairs}`;

  pairs.forEach((item) => {
    deck.push(createCard(item, "text"));
    deck.push(createCard(item, "emoji"));
  });

  deck.sort(() => Math.random() - 0.5);
  deck.forEach((card) => boardContainer.appendChild(card));
  newGame.focus();
}

function flipCard(card) {
  if (isLocked) return;
  if (card.classList.contains("flipped")) return;
  if (card.classList.contains("matched")) return;

  card.classList.add("flipped");
  clickedCards.push(card);

  if (clickedCards.length === 2) {
    isLocked = true;
    const [first, second] = clickedCards;
    moves++;
    moveCounter.textContent = `Moves: ${moves}`;

    if (first.dataset.match === second.dataset.match) {
      first.classList.add("matched");
      second.classList.add("matched");
      first.setAttribute("aria-label", "Matched!");
      second.setAttribute("aria-label", "Matched!");
      matchedPairs++;
      pairsCounter.textContent = `Pairs: ${matchedPairs}`;
      clickedCards = [];
      isLocked = false;

      if (matchedPairs === pairs.length) {
        setTimeout(() => alert(`🎉 You won in ${moves} moves!`), 300);
      }
    } else {
      setTimeout(() => {
        first.classList.remove("flipped");
        second.classList.remove("flipped");
        clickedCards = [];
        isLocked = false;
      }, 1000);
    }
  }
}

function createCard(item, type) {
  const card = document.createElement("div");
  card.classList.add("card");
  card.setAttribute("tabindex", "0");
  card.setAttribute(
    "aria-label",
    `Card: ${type === "emoji" ? item.emoji : item.text}`,
  );
  card.setAttribute("role", "button");

  const inner = document.createElement("div");
  inner.classList.add("card-inner");

  const front = document.createElement("div");
  front.classList.add("card-front");
  front.textContent = "❓";

  const back = document.createElement("div");
  back.classList.add("card-back");
  back.textContent = type === "emoji" ? item.emoji : item.text;

  inner.appendChild(front);
  inner.appendChild(back);
  card.appendChild(inner);

  card.dataset.match = item.text;

  card.addEventListener("click", () => flipCard(card));

  card.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      flipCard(card);
    }
  });

  return card;
}
