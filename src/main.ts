"use strict";

const CARROT_SIZE = 80;
const CARROT_COUNT = 20;
const BUG_COUNT = 20;
const GAME_DURATION_SEC = 20;

const field = document.querySelector(".game__field") as HTMLElement;
const fieldRect = field?.getBoundingClientRect();
const gameBtn = document.querySelector(".game__button") as HTMLElement;
const timerIndicator = document.querySelector(".game__timer") as HTMLElement;
const gameScore = document.querySelector(".game__score") as HTMLElement;

const popUp = document.querySelector(".pop-up") as HTMLElement;
const popUpText = document.querySelector(".pop-up__message") as HTMLElement;
const popUpRefresh = document.querySelector(".pop-up__refresh") as HTMLElement;

const carrotSound = new Audio("./sound/carrot_pull.mp3");
const alertSound = new Audio("./sound/alert.wav");
const bgSound = new Audio("./sound/bg.mp3");
const bugSound = new Audio("./sound/bug_pull.mp3");
const winSound = new Audio("./sound/game_win.mp3");

let started = false;
let score = 0;
let timer: number | undefined = undefined;

field.addEventListener("click", onFieldClick);
gameBtn.addEventListener("click", () => {
  if (started) {
    stopGame();
  } else {
    startGame();
  }
});
popUpRefresh.addEventListener("click", () => {
  startGame();
  hidePopUp();
});

function startGame() {
  started = true;
  initGame();
  showStopButton();
  showTimerAndScore();
  startGameTimer();
  playSound(bgSound);
}

function stopGame() {
  started = false;
  stopGameTimer();
  hideGameButton();
  showPopUpWithText("REPLAY❓");
  playSound(alertSound);
  stopSound(bgSound);
}

function finishGame(win: boolean) {
  started = false;
  hideGameButton();
  if (win) {
    playSound(winSound);
  } else {
    playSound(bugSound);
  }
  stopGameTimer();
  stopSound(bgSound);
  showPopUpWithText(win ? "YOU WON 🎉" : "YOU LOST 💩");
}

function showStopButton() {
  const icon = gameBtn.querySelector(".fas");
  icon?.classList.add("fa-stop");
  icon?.classList.remove("fa-play");
  gameBtn.style.visibility = "visible";
}

function hideGameButton() {
  gameBtn.style.visibility = "hidden";
}

function showTimerAndScore() {
  timerIndicator.style.visibility = "visible";
  gameScore.style.visibility = "visible";
}

function startGameTimer() {
  let remainingTimeSec = GAME_DURATION_SEC;
  updateTimerText(remainingTimeSec);
  timer = setInterval(() => {
    if (remainingTimeSec <= 0) {
      clearInterval(timer);
      finishGame(score === CARROT_COUNT);
      return;
    }
    updateTimerText(--remainingTimeSec);
  }, 1000);
}

function stopGameTimer() {
  clearInterval(timer);
}

function updateTimerText(time: number) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  if (timerIndicator) {
    timerIndicator.innerHTML = `${minutes}:${seconds}`;
  }
}

function showPopUpWithText(text: string) {
  popUpText.innerText = text;
  popUp.classList.remove("pop-up--hide");
}

function hidePopUp() {
  popUp?.classList.add("pop-up--hide");
}

function initGame() {
  score = 0;
  field.innerHTML = "";
  gameScore.innerText = CARROT_COUNT.toString();
  // 벌레와 당근을 생성한뒤 field에 추가해줌
  addItem("carrot", CARROT_COUNT, "img/carrot.png");
  addItem("bug", BUG_COUNT, "img/bug.png");
}

function onFieldClick(event: Event) {
  if (!started) {
    return;
  }
  const target = event.target as HTMLElement;
  if (target?.matches(".carrot")) {
    // 당근!!
    target.remove();
    score++;
    playSound(carrotSound);
    updateScoreBoard();
    if (score === CARROT_COUNT) {
      finishGame(true);
    }
  } else if (target.matches(".bug")) {
    finishGame(false);
  }
}

function playSound(sound: HTMLAudioElement) {
  sound.currentTime = 0;
  sound.play();
}

function stopSound(sound: HTMLAudioElement) {
  sound.pause();
}

function updateScoreBoard() {
  gameScore.innerText = (CARROT_COUNT - score).toString();
}

function addItem(className: string, count: number, imgPath: string) {
  const x1 = 0;
  const y1 = 0;
  const x2 = fieldRect?.width - CARROT_SIZE;
  const y2 = fieldRect?.height - CARROT_SIZE;
  for (let i = 0; i < count; i++) {
    const item = document.createElement("img");
    item.setAttribute("class", className);
    item.setAttribute("src", imgPath);
    item.style.position = "absolute";
    const x = randomNumber(x1, x2);
    const y = randomNumber(y1, y2);
    item.style.left = `${x}px`;
    item.style.top = `${y}px`;
    field?.appendChild(item);
  }
}

function randomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
