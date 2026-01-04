const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const message = document.getElementById("message");

let timeLeft = 60;

let timerId = null;   // 倒數
let moveId = null;    // 高速移動
let playing = false;

// ✅ 星星速度：調快到會有殘影（每 16ms 約 60FPS）
// 你要「快到出現殘影」=> 直接用高頻率 + ghost 殘影
const moveMs = 3;

// 殘影強度（每幾次移動留一次殘影；數字越小越多殘影）
const ghostEveryNMoves = 1;
let moveCount = 0;

function ensureWinOverlay() {
  let overlay = document.getElementById("winOverlay");
  if (overlay) return overlay;

  overlay = document.createElement("div");
  overlay.id = "winOverlay";
  overlay.innerHTML = `<div class="text">你贏了!!!</div>`;
  gameArea.appendChild(overlay);
  return overlay;
}

function showWinOverlay() {
  const overlay = ensureWinOverlay();
  overlay.classList.add("show");
}

function hideWinOverlay() {
  const overlay = document.getElementById("winOverlay");
  if (overlay) overlay.classList.remove("show");
}

function startGame() {
  playing = true;
  timeLeft = 60;
  timeEl.textContent = timeLeft;

  message.textContent = "點到⭐就贏了。";
  gameArea.style.display = "block";
  hideWinOverlay();

  // 初始化一次
  rollTargetType();
  moveTargetRandom(true);

  clearInterval(timerId);
  clearInterval(moveId);

  timerId = setInterval(() => {
    if (!playing) return;

    timeLeft -= 1;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);

  // ✅ 高速移動
  moveId = setInterval(() => {
    if (!playing) return;
    moveTargetRandom(false);
  }, moveMs);
}

function endGame(win) {
  playing = false;
  clearInterval(timerId);
  clearInterval(moveId);

  if (win) {
    message.textContent = "你贏了！🎉";
    // ✅ 獲勝提示：正中央、超大、很強調
    showWinOverlay();
  } else {
    message.textContent = "時間到！";
    hideWinOverlay();
  }
}

// 有機率變金色星星
function rollTargetType() {
  const isGold = Math.random() < 1;
  if (isGold) {
    target.classList.add("gold");
    target.textContent = "⭐";
  } else {
    target.classList.remove("gold");
    target.textContent = "🎯";
  }
}

// ✅ 產生殘影
function spawnGhost(leftPx, topPx, isGold) {
  const ghost = document.createElement("div");
  ghost.className = "ghost" + (isGold ? " gold" : "");
  ghost.textContent = isGold ? "⭐" : "🎯";
  ghost.style.left = `${leftPx}px`;
  ghost.style.top = `${topPx}px`;

  gameArea.appendChild(ghost);

  ghost.addEventListener("animationend", () => {
    ghost.remove();
  });
}

function moveTargetRandom(forceReroll) {
  const areaRect = gameArea.getBoundingClientRect();

  const tRect = target.getBoundingClientRect();
  const tW = tRect.width || 80;
  const tH = tRect.height || 80;

  const maxX = Math.max(0, areaRect.width - tW);
  const maxY = Math.max(0, areaRect.height - tH);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  const left = x + tW / 2;
  const top = y + tH / 2;

  // ✅ 留殘影（在 target 移動前先留一個）
  moveCount += 1;
  if (moveCount % ghostEveryNMoves === 0) {
    spawnGhost(
      parseFloat(target.style.left) || left,
      parseFloat(target.style.top) || top,
      target.classList.contains("gold")
    );
  }

  target.style.left = `${left}px`;
  target.style.top = `${top}px`;

  // ✅ 讓金色星星在高速移動時也會不斷出現/變化（更刺激）
  if (forceReroll || Math.random() < 0.08) {
    rollTargetType();
  }
}

// 點到目標
target.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!playing) return;

  // ✅ 點到星星就贏
  if (target.classList.contains("gold")) {
    endGame(true);
    return;
  }

  // 點到非星星：維持原本手感（立即換位置）
  rollTargetType();
  moveTargetRandom(true);
});

// ✅ 點到空白不會有事
gameArea.addEventListener("click", () => {
  if (!playing) return;
  // do nothing
});

startBtn.addEventListener("click", startGame);

// 初始不自動開始（維持原本按開始）



