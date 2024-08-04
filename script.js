document.addEventListener('DOMContentLoaded', () => {
    const page = document.body.id;
    if (page === 'game') {
        setupGamePage();
    } else if (page === 'score') {
        setupScorePage();
    }
});

function startGame() {
    window.location.href = 'game.html';
}

function returnToMenu() {
    window.location.href = 'index.html';
}

function setupGamePage() {
    startGameSession();
}

function setupScorePage() {
    const finalScore = localStorage.getItem('finalScore');
    document.getElementById('final-score').textContent = finalScore;
}

const cardImages = [
    'Assets/Cards/card-sun.png', 'Assets/Cards/card-fish.png', 'Assets/Cards/card-skull.png', 'Assets/Cards/card-cactus.png', 
    'Assets/Cards/card-frog.png', 'Assets/Cards/card-mermaid.png', 'Assets/Cards/card-flag.png', 'Assets/Cards/card-spider.png', 'Assets/Cards/card-umbrella.png'
];

let timer;
let time;
let moves;
let firstCard, secondCard;
let lockBoard = false;
let pairsFound;

function startGameSession() {
    time = 0;
    moves = 0;
    pairsFound = 0;
    firstCard = secondCard = null;
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    document.getElementById('moves').textContent = `${moves}`;
    document.getElementById('timer').textContent = '00:00';
    clearInterval(timer);
    timer = setInterval(updateTimer, 1000);
    createCards();
}

function createCards() {
    const cards = [...cardImages, ...cardImages]
        .sort(() => 0.5 - Math.random())
        .map(image => createCard(image));
    cards.forEach(card => document.getElementById('game-board').appendChild(card));
}

function createCard(image) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front" style="background-image: url('${image}')"></div>
            <div class="card-back"></div>
        </div>`;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (lockBoard || this === firstCard) return;
    this.classList.add('flip');
    if (!firstCard) {
        firstCard = this;
    } else {
        secondCard = this;
        moves++;
        document.getElementById('moves').textContent = `${moves}`;
        checkForMatch();
    }
}

function checkForMatch() {
    const firstCardImage = getComputedStyle(firstCard.querySelector('.card-front')).backgroundImage;
    const secondCardImage = getComputedStyle(secondCard.querySelector('.card-front')).backgroundImage;
    const isMatch = firstCardImage === secondCardImage;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    firstCard.removeEventListener('click', flipCard);
    secondCard.removeEventListener('click', flipCard);
    resetBoard();
    pairsFound++;
    if (pairsFound === cardImages.length) {
        endGame();
    }
}

function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

function updateTimer() {
    time++;
    const minutes = Math.floor(time / 60).toString().padStart(2, '0');
    const seconds = (time % 60).toString().padStart(2, '0');
    document.getElementById('timer').textContent = `${minutes}:${seconds}`;
}

function endGame() {
    clearInterval(timer);
    const finalScore = `${moves} movements in ${document.getElementById('timer').textContent}`;
    localStorage.setItem('finalScore', finalScore);
    window.location.href = 'score.html';
}