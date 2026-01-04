const timeEl = document.getElementById("time");
const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");
const target = document.getElementById("target");
const message = document.getElementById("message");

let timeLeft = 60;

let timerId = null;  // 倒數用
let moveId = null;   // 目標自動移動用
let playing = false;

// 固定速度（不會越來越快）
// ✅ 完全保留你原本的速度設定（一個字都不改）
const moveMs = 0.0000000000001;       // 目標每 ?秒換一次位置

function startGame() {
  // 初始化狀態
  playing = true;
  timeLeft = 60;
  timeEl.textContent = timeLeft;

  message.textContent = "點到⭐就贏了。";
  gameArea.style.display = "block";

  // 先決定目標型態，再移動一次
  rollTargetType();
  moveTargetRandom();

  // 清掉舊的計時/移動
  clearInterval(timerId);
  clearInterval(moveId);

  // 倒數計時（1 秒一次）
  timerId = setInterval(() => {
    if (!playing) return;

    timeLeft -= 1;
    timeEl.textContent = timeLeft;

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);

  // 目標自動移動（✅ 速度完全照你原本 moveMs）
  moveId = setInterval(() => {
    if (!playing) return;
    moveTargetRandom();
  }, moveMs);
}

function endGame(win) {
  playing = false;
  clearInterval(timerId);
  clearInterval(moveId);

  if (win) {
    message.textContent = "你贏了！🎉";
  } else {
    message.textContent = "時間到！";
  }
}

// 隨機決定是否變成「金色星星」
// （你 CSS 已經有 #target.gold，代表原本就有這個機制）
function rollTargetType() {
  // 這段是補回你原本檔案中「...」缺失的內容（用途保持一致）
  // 讓 target 有時候會是金色星星
  const isGold = Math.random() < 0.2; // 20% 機率
  if (isGold) {
    target.classList.add("gold");
    target.textContent = "⭐";
  } else {
    target.classList.remove("gold");
    target.textContent = "🎯";
  }
}

// 把目標移動到 gameArea 內的隨機位置
function moveTargetRandom() {
  const areaRect = gameArea.getBoundingClientRect();

  // 取 target 尺寸，避免跑出邊界
  const tRect = target.getBoundingClientRect();
  const tW = tRect.width || 80;
  const tH = tRect.height || 80;

  const maxX = Math.max(0, areaRect.width - tW);
  const maxY = Math.max(0, areaRect.height - tH);

  const x = Math.random() * maxX;
  const y = Math.random() * maxY;

  target.style.left = `${x + tW / 2}px`;
  target.style.top = `${y + tH / 2}px`;
}

// 點到目標
target.addEventListener("click", (e) => {
  e.stopPropagation();
  if (!playing) return;

  // ✅ 你要的規格：點到星星就贏
  if (target.classList.contains("gold")) {
    endGame(true);
    return;
  }

  // ✅ 其他都不改：維持原本手感（點到後立刻換位置）
  rollTargetType();
  moveTargetRandom();
});

// ✅ 你要的規格：點到空白不會有事
// （所以移除原本扣分邏輯；其他不做任何動作）
gameArea.addEventListener("click", () => {
  if (!playing) return;
  // do nothing
});

startBtn.addEventListener("click", startGame);
