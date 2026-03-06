const quizData = [
  { q: '도라에몽이 가장 좋아하는 음식은?', a: ['단팥빵', '피자'], cor: 0 },
  { q: '도라에몽의 몸 색깔은?', a: ['빨강색', '파랑색'], cor: 1 },
  { q: '도라에몽은 어떤 동물 로봇?', a: ['고양이', '강아지'], cor: 0 },
  { q: '진구의 단짝 친구는?', a: ['퉁퉁이', '도라에몽'], cor: 1 },
  { q: '도라에몽이 무서워하는 것은?', a: ['쥐', '거미'], cor: 0 },
  {
    q: '어디로든 갈 수 있는 문 이름은?',
    a: ['어디로든 문', '비밀 문'],
    cor: 0,
  },
  { q: '퉁퉁이의 취미는?', a: ['노래하기', '요리하기'], cor: 0 },
  { q: '진구가 항상 쓰는 것은?', a: ['모자', '안경'], cor: 1 },
  { q: '도라에몽의 주머니 위치는?', a: ['등', '배'], cor: 1 },
  { q: '비실이의 성격은?', a: ['자랑쟁이', '겁쟁이'], cor: 0 },
  { q: '도라에몽 동생의 이름은?', a: ['도라미', '도라희'], cor: 0 },
  { q: '타임머신은 어디에 있나요?', a: ['책상 서랍', '옷장'], cor: 0 },
];

let currentIdx = 0;
let score = 0;
let timeLeft = 5;
let timerId = null;
let playerX = 50;

const player = document.getElementById('player');
const doorL = document.getElementById('doorLeft');
const doorR = document.getElementById('doorRight');

document.getElementById('startButton').onclick = () => {
  document.getElementById('startPage').classList.add('hidden');
  document.getElementById('gamePage').classList.remove('hidden');
  loadQuestion();
};

document.getElementById('retryButton').onclick = () => {
  location.reload(); // 다시하기는 깔끔하게 리로드
};

document.addEventListener('keydown', (e) => {
  if (document.getElementById('gamePage').classList.contains('hidden')) return;
  if (e.key === 'ArrowLeft') playerX = 20;
  else if (e.key === 'ArrowRight') playerX = 80;
  player.style.left = playerX + '%';
});

function loadQuestion() {
  if (currentIdx >= quizData.length) return showResult();

  // 문 애니메이션 리셋 (클래스 제거)
  doorL.classList.remove('approach');
  doorR.classList.remove('approach');

  setTimeout(() => {
    timeLeft = 5;
    playerX = 50;
    player.style.left = '50%';
    document.getElementById('timer').innerText = timeLeft;

    const data = quizData[currentIdx];
    document.getElementById('questionText').innerText = data.q;
    document.getElementById('labelLeft').innerText = data.a[0];
    document.getElementById('labelRight').innerText = data.a[1];

    // 문 애니메이션 시작
    doorL.classList.add('approach');
    doorR.classList.add('approach');

    if (timerId) clearInterval(timerId);
    timerId = setInterval(() => {
      timeLeft--;
      document.getElementById('timer').innerText = timeLeft;
      if (timeLeft <= 0) {
        clearInterval(timerId);
        judge();
      }
    }, 1000);
  }, 50);
}

function judge() {
  const data = quizData[currentIdx];
  const playerChoice = playerX < 50 ? 0 : 1;
  const isCorrect = playerChoice === data.cor;
  const fbDiv = document.getElementById('feedback');
  const fbImg = document.getElementById('feedbackImg');

  fbImg.src = isCorrect
    ? '/image/doraemonSuccess.png'
    : '/image/tungtungMom.png';
  if (isCorrect) score++;

  fbDiv.classList.remove('hidden');

  setTimeout(() => {
    fbDiv.classList.add('hidden');
    currentIdx++;
    loadQuestion();
  }, 1200);
}

function showResult() {
  document.getElementById('gamePage').classList.add('hidden');
  document.getElementById('resultPage').classList.remove('hidden');
  document.getElementById('finalScoreText').innerText =
    `최종 점수: ${score} / 12`;
}
