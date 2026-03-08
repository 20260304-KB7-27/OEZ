/*
 * [도라에몽 5초 퀴즈] 메인 로직
 * 1. 게임 상태 관리 (시작, 진행, 종료)
 * 2. 0.1초 단위의 소수점 타이머 구현
 * 3. 키보드 입력을 통한 캐릭터(진구) 이동
 * 4. 종료 시 위치 판정 및 퉁퉁이 엄마 등장 로직
 */

/* --- 1. DOM 요소 참조 --- */
const startPage = document.getElementById('startPage');
const gamePage = document.getElementById('gamePage');
const resultPage = document.getElementById('resultPage');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const timerDisplay = document.getElementById('timer');
const player = document.getElementById('player');

/* 추가된 박스 요소들 */
const successBox = document.getElementById('successBox');
const failBox = document.getElementById('failBox');
const userScore = document.getElementById('userScore');

/* --- 2. 게임 변수 --- */
let timeLeft = 5.0;
let timerId = null;
let playerPos = 50;
let isGameActive = false;

/* --- 3. 게임 시작 함수 --- */
function startGame() {
  timeLeft = 5.0;
  playerPos = 50;
  isGameActive = true;

  startPage.classList.add('hidden');
  resultPage.classList.add('hidden');
  gamePage.classList.remove('hidden');

  /* 결과 박스들 미리 숨기기 */
  successBox.classList.add('hidden');
  failBox.classList.add('hidden');

  player.style.left = playerPos + '%';

  timerId = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      endGame(); /* 0초가 되면 종료 함수 실행 */
    }
    timerDisplay.innerText = timeLeft.toFixed(1);
  }, 100);
}

/* --- 4. 게임 종료 및 결과 판정 (중요!) --- */
function endGame() {
  isGameActive = false;
  clearInterval(timerId);

  gamePage.classList.add('hidden');
  resultPage.classList.remove('hidden');

  /* 판정: 진구가 왼쪽(단팥빵, 40% 미만)에 있는지 확인 */
  if (playerPos < 40) {
    /* 정답인 경우: 성공 박스 보여주기 */
    if (userScore) userScore.innerText = '12';
    successBox.classList.remove('hidden');
    failBox.classList.add('hidden');
  } else {
    /* 오답이거나 시간 초과인 경우: 실패 박스(퉁퉁이 엄마) 보여주기 */
    successBox.classList.add('hidden');
    failBox.classList.remove('hidden');
  }
}

/* --- 5. 이동 로직 --- */
window.addEventListener('keydown', (e) => {
  if (!isGameActive) return;
  if (e.key === 'ArrowLeft') playerPos -= 5;
  else if (e.key === 'ArrowRight') playerPos += 5;

  if (playerPos < 10) playerPos = 10;
  if (playerPos > 90) playerPos = 90;
  player.style.left = playerPos + '%';
});

startButton.addEventListener('click', startGame);
retryButton.addEventListener('click', startGame);
