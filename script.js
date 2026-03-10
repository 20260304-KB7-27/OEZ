/*
 * [도라에몽 5초 퀴즈] 메인 로직
문제 시작 로직 및 노진구 위치기반 정답 확인 로직 구현
 */

// 퀴즈 데이터
import { dummyQuestions } from './quetions.js';

/* --- 1. DOM 요소 참조 --- */
const startPage = document.getElementById('startPage');
const gamePage = document.getElementById('gamePage');
const resultPage = document.getElementById('resultPage');
const startButton = document.getElementById('startButton');
const retryButton = document.getElementById('retryButton');
const timerDisplay = document.getElementById('timer');
const player = document.getElementById('player');

const successBox = document.getElementById('successBox'); // 참 잘했어요 박스
const failBox = document.getElementById('failBox'); // 😱 퉁퉁이 엄마 박스
const userScore = document.getElementById('userScore');

const questionText = document.getElementById('questionText');
const doorLeftLabel = document.querySelector('#doorLeft .door-label');
const doorRightLabel = document.querySelector('#doorRight .door-label');
const maxScore = document.getElementById('maxScore');

/* --- 2. 게임 변수 및 데이터 --- */
let timeLeft = 5.0;
let timerId = null;
let isGameActive = false;
let isAnswered = false;
let currentQ = 0;
let score = 0;
// 타이머 효과음
const timerSound = new Audio('./image/TimerFixed.mp3');
timerSound.preload = 'auto';
// 게임 성공 효과음 (모든 문제 맞췄을 때)
const gameSuccessSound = new Audio('./image/gameClear.mp3');
gameSuccessSound.preload = 'auto';

// 게임 오버 효과음 (오답 또는 시간초과)b
const gameOverSound = new Audio('./image/gameOver.mp3');
gameOverSound.preload = 'auto';

/* --- 3. [게임 초기화] --- */
function initGame() {
  currentQ = 0;
  score = 0;

  // 결과 효과음이 재생 중이면 모두 정지 (빠르게 다시하기 눌렀을 때 겹침 방지)
  gameOverSound.pause();
  gameOverSound.currentTime = 0;

  gameSuccessSound.pause();
  gameSuccessSound.currentTime = 0;

  dummyQuestions.sort(function () {
    return Math.random() - 0.5;
  });

  startGame();
}

/* --- 4. 게임(한 문제) 시작 함수 --- */
function startGame() {
  if (questionText) questionText.innerText = dummyQuestions[currentQ].q;
  if (doorLeftLabel) doorLeftLabel.innerText = dummyQuestions[currentQ].a1;
  if (doorRightLabel) doorRightLabel.innerText = dummyQuestions[currentQ].a2;

  timeLeft = 5.0;
  // 타이머 소리 시작
  timerSound.currentTime = 0;
  timerSound.play();
  isGameActive = true;
  isAnswered = false;

  startPage.classList.add('hidden');
  resultPage.classList.add('hidden');
  gamePage.classList.remove('hidden');

  successBox.classList.add('hidden');
  failBox.classList.add('hidden');

  player.style.transition = 'none';
  player.style.left = '50%';

  if (timerId) clearInterval(timerId);

  timerId = setInterval(() => {
    timeLeft -= 0.1;
    if (timeLeft <= 0) {
      timeLeft = 0;
      timerDisplay.innerText = timeLeft.toFixed(1);

      if (!isAnswered) endGame('none');
    } else {
      timerDisplay.innerText = timeLeft.toFixed(1);
    }
  }, 100);
}

/* --- 5. 게임 종료 및 결과 판정 ---  위치기반 정답확인 함수*/
function endGame(chosenDirection) {
  isGameActive = false;
  clearInterval(timerId);
  // 타이머 소리 정지
  timerSound.pause();
  timerSound.currentTime = 0;

  let correctDoor = dummyQuestions[currentQ].answer;

  // 1. 시간 초과일 경우
  if (chosenDirection === 'none') {
    // 팝업창 삭제 완료! 바로 퉁퉁이 엄마 화면으로 넘어갑니다.
    showResultPage(false);
    return;
  }

  // 2. 정답일 경우
  if (chosenDirection === correctDoor) {
    score++;
    currentQ++;

    if (currentQ < dummyQuestions.length) {
      startGame();
    } else {
      // 12문제 올클리어!
      showResultPage(true);
    }
  }
  // 3. 오답일 경우
  else {
    // 팝업창 삭제 완료! 바로 퉁퉁이 엄마 화면으로 넘어갑니다.
    showResultPage(false);
  }
}

/* --- 6. 결과 화면 보여주기 --- */
function showResultPage(isSuccess) {
  gamePage.classList.add('hidden');
  resultPage.classList.remove('hidden');

  if (userScore) userScore.innerText = score;
  if (maxScore) maxScore.innerText = dummyQuestions.length;

  //  성공/실패에 따라 박스 띄우기
  if (isSuccess) {
    successBox.classList.remove('hidden'); // 성공 박스 켜기
    failBox.classList.add('hidden');

    // 게임 클리어 효과음 재생
    gameSuccessSound.currentTime = 0;
    gameSuccessSound.play();
  } else {
    successBox.classList.add('hidden');
    failBox.classList.remove('hidden'); // 퉁퉁이 엄마 박스 켜기!

    // 게임 오버 효과음 재생
    gameOverSound.currentTime = 0;
    gameOverSound.play();
  }
}

/* --- 7. 이동 로직 --- */
window.addEventListener('keydown', (e) => {
  if (!isGameActive || isAnswered) return;

  player.style.transition = 'left 0.15s linear';

  if (e.key === 'ArrowLeft') {
    isAnswered = true;
    clearInterval(timerId);
    player.style.left = '25%';

    setTimeout(() => {
      endGame('left');
    }, 150);
  } else if (e.key === 'ArrowRight') {
    isAnswered = true;
    clearInterval(timerId);
    player.style.left = '75%';

    setTimeout(() => {
      endGame('right');
    }, 150);
  }
});

/* --- 8. 이벤트 리스너 --- */
startButton.addEventListener('click', initGame);
retryButton.addEventListener('click', initGame);
