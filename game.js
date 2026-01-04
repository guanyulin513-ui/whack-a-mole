(() => {
  const stage = document.getElementById("stage");
  const timeLeftEl = document.getElementById("timeLeft");
  const statusText = document.getElementById("statusText");
  const btnRestart = document.getElementById("btnRestart");

  const GAME_SECONDS = 60;

  let timerId = null;
  let timeLeft = GAME_SECONDS;
  let gameEnded = false;

  // 產生星星（單顆，點到就贏）
  function spawnStar() {
    stage.innerHTML = "";

    const star = document.createElement("div");
    star.className = "star";
    star.setAttribute("role", "button");
    star.setAttribute("aria-label", "星星");
    star.textContent = "⭐";

    // 隨機位置（避免貼邊）
    const rect = stage.getBoundingClientRect();
    const padding = 40;
    const x = rand(padding, Math.max(padding, rect.width - padding));
    const y = rand(padding, Math.max(padding, rect.height - padding));

    star.style.left = `${x}px`;
    star.style.top = `${y}px`;

    // 點到星星就贏
    star.addEventListener("click", (e) => {
      e.stopPropagation();
      winGame();
    });

    stage.appendChild(star);
  }

  // 點到空白不會有事：只在遊戲結束後給提示（不扣分、不變化）
  stage.addEventListener("click", () => {
    if (gameEnded) return;
    // 依需求：點空白不會有事 -> 什麼都不做
  });

  function startGame() {
    clearInterval(timerId);
    gameEnded = false;

    timeLeft = GAME_SECONDS;
    timeLeftEl.textContent = String(timeLeft);
    statusText.textContent = "遊戲開始！點到星星就贏！";

    spawnStar();

    timerId = setInterval(() => {
      if (gameEnded) return;

      timeLeft -= 1;
      timeLeftEl.textContent = String(timeLeft);

      if (timeLeft <= 0) {
        loseGame();
      }
    }, 1000);
  }

  function winGame() {
    if (gameEnded) return;
    gameEnded = true;
    clearInterval(timerId);
    statusText.textContent = "你贏了！🎉（點重新開始再玩一次）";
  }

  function loseGame() {
    if (gameEnded) return;
    gameEnded = true;
    clearInterval(timerId);
    statusText.textContent = "時間到！再試一次～（點重新開始）";
  }

  function rand(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  // 視窗尺寸變動時，重新放置星星（保持在可視區）
  window.addEventListener("resize", () => {
    if (gameEnded) return;
    spawnStar();
  });

  btnRestart.addEventListener("click", startGame);

  // 初始啟動
  startGame();
})();
