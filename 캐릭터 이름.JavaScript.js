const characters = [
    { name: "도라", image: "도라 1.png" }, //천공의
    { name: "무스카", image: "무스카 4.jpg" },
    { name: "시타",  image: "시타 3.jpeg" },// 섬 라퓨타
    { name: "바론",  image: "바론 1.png" },//고양이
    { name: "하루",  image: "하루 1.png" },
    { name: "유키",  image: "유키 3.png" },//보은
    { name: "마르클",  image: "마르클 1.png" },// 하울의
    { name: "황야의 마녀",  image: "황야의 마녀 2.png" },
    { name: "설리만",  image: "설리만 2.jpg" },
    { name: "소피",  image: "소피 4.png" },//움직이는성
    { name: "포뇨",  image: "포뇨 2.png" },//벼랑위의
    { name: "소스케",  image: "소스케 5.png" },
    { name: "그랜맘마레",  image: "그랜맘마레 4.png" },
    { name: "후지모토",  image: "후지모토 4.png" },//포뇨
    { name: "칸타",  image: "칸타 5.jfif" },//이웃집
    { name: "사스키",  image: "쿠사카베 사스키 5.png" },
    { name: "토토로",  image: "토토로 5.png" },//토토로
    { name: "가오나시",  image: "가오나시 3.jpg" },// 센과 치히로의
    { name: "가마 할아범",  image: "가마 할아범 5.jpg" },
    { name: "유바바",  image: "유바바 4.png" },
    { name: "하쿠",  image: "하쿠 2.png" }// 행방불명
];


// 기본 게임 설정
const totalQuestions = 10;  // 출제할 문제 수 (10개로 고정)
let currentCharacterIndex = 0;
let score = 0; // 초기 점수 설정
let timeLeft = 30; // 시간 제한(초)
let timer; // 타이머 변수
let shuffledCharacters = []; // 섞인 문제 배열
let hasAnsweredCorrectly = false; // 정답 여부를 체크하는 변수

// 문제 로드시 
document.addEventListener("DOMContentLoaded", () => {
    shuffledCharacters = getRandomCharacters(characters, totalQuestions); // 문제 배열 섞기
    loadCharacter();  // 페이지가 로드된 후 첫 번째 문제를 불러옴
});

// 22개 중 10개 캐릭터 랜덤 선택
function getRandomCharacters(array, num) {
    const shuffledArray = shuffleArray([...array]); // 배열 섞기
    return shuffledArray.slice(0, num); // 섞은 배열에서 num개만 선택
}

// 배열을 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // 두 요소를 교환
    }
    return array;
}

// 게임 시작 시 첫 번째 캐릭터 로드
function loadCharacter() {
    const character = shuffledCharacters[currentCharacterIndex];
    
    // 이미지 표시
    const imageElement = document.getElementById("character-image");
    imageElement.src = character.image;

    // 이미지 로드 체크
    imageElement.onload = () => {
        document.getElementById("result").innerText = ''; 
        document.getElementById("answer-input").value = ''; 
        document.getElementById("answer-input").disabled = false; // 입력 필드 활성화
        resetTimer(); // 타이머 초기화

        // 남은 문제 수 업데이트
        document.getElementById("questions-left").innerText = shuffledCharacters.length - currentCharacterIndex;
    }

    // 오류 처리
    imageElement.onerror = () => {
        console.error("이미지 로드 실패: " + character.image);
        document.getElementById("result").innerText = "이미지를 불러올 수 없습니다. 파일 경로를 확인하세요.";
    };
}

// 시간 설정
function resetTimer() {
    clearInterval(timer);
    timeLeft = 30; // 초기 시간 설정
    document.getElementById("timer").innerText = `남은 시간: ${timeLeft}초`;

    timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = `남은 시간: ${timeLeft}초`;
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            document.getElementById("result").innerText = "시간이 다 되었습니다!"; // 시간 초과 시 메시지
            document.getElementById("answer-input").disabled = true;
        }
    }, 1000);
}

function nextCharacter() {
    currentCharacterIndex++;
    if (currentCharacterIndex < shuffledCharacters.length) {
        loadCharacter();
    } else {
        endGame();
    }
}

// 제출 버튼 클릭
document.getElementById("submit-button").addEventListener("click", () => {
    // 이미 정답을 맞혔으면 점수를 추가하지 않도록 차단
    if (hasAnsweredCorrectly) {
        alert("이미 정답을 맞혔습니다.");
        return; // 점수 처리를 막기 위해 함수 종료
    }

    const answer = document.getElementById("answer-input").value.trim().replace(/\s+/g, '').toLowerCase(); // 공백 제거 및 소문자 변환
    const correctAnswer = shuffledCharacters[currentCharacterIndex].name.trim().replace(/\s+/g, '').toLowerCase(); // 정답의 공백 제거

    // 정답 확인
    if (answer === correctAnswer) {
        score += 1; // 점수 1점
        document.getElementById("result").innerText = "정답입니다! 🎉";
        document.getElementById("score").innerText = `현재 점수: ${score}`; // 점수 표시 업데이트
        clearInterval(timer); // 정답 맞히면 타이머 멈추기

        // 정답을 맞혔으므로 점수 중복 방지를 위한 처리
        hasAnsweredCorrectly = true;

        // 제출 버튼 비활성화
        document.getElementById("submit-button").disabled = true;
    } else {
        document.getElementById("result").innerText = "틀렸습니다!";
    }
});

// 다음 문제로 넘기기 버튼 
document.getElementById("next-button").addEventListener("click", () => {
    nextCharacter();
    hasAnsweredCorrectly = false; // 새로운 문제로 넘어갈 때 정답 여부 초기화
    document.getElementById("submit-button").disabled = false; // 제출 버튼 활성화
});

// 나가기 버튼 클릭시 초기화 및 메인으로 이동
document.getElementById("reset-button").addEventListener("click", () => {
    localStorage.removeItem('players');
    window.location.href = 'https://tngodj.github.io/Retire-Page/'; // 소개 페이지로 이동 --------------------------------------------------------------
});

// 게임 종료 처리
function endGame() {
    clearInterval(timer); // 타이머 정지

    const playerName = prompt("이름을 입력하세요:"); // 플레이어 이름 입력
    if (playerName) {
        // 기존에 저장된 플레이어 리스트를 로드
        let players = JSON.parse(localStorage.getItem('players')) || [];

        // 새로운 플레이어 추가
        players.push({ name: playerName, score: score });

        // 점수 내림차순으로 정렬
        players.sort((a, b) => b.score - a.score);

        // 로컬 스토리지에 점수 저장
        localStorage.setItem('players', JSON.stringify(players));

        // 5명이 넘으면 자동 초기화
        if (players.length > 5) {
            alert("플레이어가 5명이 넘었습니다. 순위가 초기화됩니다.");
            localStorage.removeItem('players'); // 순위 초기화
        } else {
            // 5명이 안 넘으면 점수 저장
            localStorage.setItem('players', JSON.stringify(players));
        }
    }

    // 결과 페이지로 이동
    window.location.href = '캐릭터 이름 결과.html'; // 순위표 페이지로 이동
}
