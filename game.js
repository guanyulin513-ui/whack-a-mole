const scoreEl = document.getElementById("score");
const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const message = document.getElementById("message");

let score = 0;
let timeLeft = 30;

let timerId = null;  // 倒數用
let moveId = null;   // 目標自動移動用
let playing = false;

// 固定速度（不會越來越快）
const moveMs = 2000;       // 目標每 ?秒換一次位置
const starChance = 0.1;  // 星星出現機率 100%

// 讓目標跳到隨機位置
function moveTargetRandom() {
  const areaWidth = gameArea.clientWidth;
  const areaHeight = gameArea.clientHeight;

  const size = target.offsetWidth;
  const maxX = areaWidth - size;
  const maxY = areaHeight - size;

  const x = Math.floor(Math.random() * maxX);
  const y = Math.floor(Math.random() * maxY);

  target.style.left = x + "px";
  target.style.top = y + "px";
}

// 決定這次是一般🎯還是金色⭐
function rollTargetType() {
  const isStar = Math.random() < starChance;

  if (isStar) {
    target.textContent = "⭐";
    target.classList.add("gold");
    target.dataset.type = "star";
  } else {
    target.textContent = "🎯";
    target.classList.remove("gold");
    target.dataset.type = "normal";
  }
}

function startGame() {
  if (playing) return;

  playing = true;
  score = 0;
  timeLeft = 30;

  scoreEl.textContent = score;
  timeEl.textContent = timeLeft;

  message.textContent = "開始！點🎯 +1 分，點⭐ +3 分；點空白 -1 分。";
  startBtn.disabled = true;

  target.style.display = "block";

  // 先放一次位置與類型
  rollTargetType();
  moveTargetRandom();

  // 固定速度自動移動（不加速）
  clearInterval(moveId);
  moveId = setInterval(() => {
    if (!playing) return;
    rollTargetType();
    moveTargetRandom();
  }, moveMs);

  // 倒數計時
  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft -= 1;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function endGame() {
  playing = false;

  clearInterval(timerId);
  clearInterval(moveId);

  target.style.display = "none";
  startBtn.disabled = false;

  message.textContent = `時間到！你的分數是：${score}`;
}

// 點到目標（🎯或⭐）
target.addEventListener("click", (e) => {
  if (!playing) return;

  // 避免點到目標也被算成點空白
  e.stopPropagation();

  const type = target.dataset.type;

  if (type === "star") score += 3;
  else score += 1;

  scoreEl.textContent = score;

  // 點到後立刻換位置，手感更好
  rollTargetType();
  moveTargetRandom();
});

// 點空白處扣分（點到 gameArea 但不是 target）
gameArea.addEventListener("click", () => {
  if (!playing) return;

  score -= 1;
  scoreEl.textContent = score;
});

startBtn.addEventListener("click", startGame);
