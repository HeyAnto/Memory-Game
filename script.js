function startGame() {
    window.location.href = 'game.html';
}

function goBack() {
    window.location.href = 'menu.html';
}

function goToMenu() {
    window.location.href = 'menu.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // Game Page Logic
    const gameBoard = document.getElementById('board');
    if (gameBoard) {
        const cards = [
            'Assets/Cards/card-sun.png', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9',
            'img1', 'img2', 'img3', 'img4', 'img5', 'img6', 'img7', 'img8', 'img9'
        ];

        let moves = 0;
        let matchedPairs = 0;
        let firstCard, secondCard;
        let isFlipping = false;
        let startTime, timerInterval;

        shuffle(cards);
        cards.forEach(card => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('card');
            cardElement.dataset.card = card;
            cardElement.innerHTML = `
                <div class="card-back"></div>
                <div class="card-front" style="background-image: url('path/to/your/${card}.jpg')"></div>
            `;
            cardElement.onclick = flipCard;
            gameBoard.appendChild(cardElement);
        });
        startTimer();

        function shuffle(array) {
            array.sort(() => Math.random() - 0.5);
        }

        function flipCard() {
            if (isFlipping || this === firstCard) return;
            this.classList.add('is-flipped');

            if (!firstCard) {
                firstCard = this;
                return;
            }

            secondCard = this;
            moves++;
            document.getElementById('moves').textContent = moves;

            checkForMatch();
        }

        function checkForMatch() {
            const isMatch = firstCard.dataset.card === secondCard.dataset.card;
            if (isMatch) {
                matchedPairs++;
                resetBoard();
                if (matchedPairs === cards.length / 2) {
                    endGame();
                }
            } else {
                isFlipping = true;
                setTimeout(() => {
                    firstCard.classList.remove('is-flipped');
                    secondCard.classList.remove('is-flipped');
                    resetBoard();
                }, 1000);
            }
        }

        function resetBoard() {
            [firstCard, secondCard] = [null, null];
            isFlipping = false;
        }

        function startTimer() {
            startTime = Date.now();
            timerInterval = setInterval(() => {
                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                const minutes = Math.floor(elapsedTime / 60).toString().padStart(2, '0');
                const seconds = (elapsedTime % 60).toString().padStart(2, '0');
                document.getElementById('timer').textContent = `${minutes}:${seconds}`;
            }, 1000);
        }

        function endGame() {
            clearInterval(timerInterval);
            localStorage.setItem('timer', document.getElementById('time').textContent);
            localStorage.setItem('moves', moves);
            window.location.href = 'score.html';
        }
    }

    // Score Page Logic
    const finalTime = document.getElementById('finalTime');
    const finalMoves = document.getElementById('finalMoves');
    if (finalTime && finalMoves) {
        finalTime.textContent = localStorage.getItem('timer');
        finalMoves.textContent = localStorage.getItem('moves');
    }
});
