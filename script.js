let apiDeckId = null;
let playerHand = [];
let dealerHand = [];
let balance = 1000; // Initial balance
let currentBet = 0;
let gameOver = true;
let messageTimeout = null;

// Fetch a new shuffled deck from the API
async function fetchShuffledDeck() {
    try {
        playShufflingSound();
        const response = await fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1');
        const data = await response.json();
        apiDeckId = data.deck_id;
    } catch (error) {
        alert("Failed to fetch a new deck. Please try again.");
    }
}

// Draw cards from the API deck
async function drawCards(count) {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${apiDeckId}/draw/?count=${count}`);
        const data = await response.json();

        if (data.remaining < count) {
            await fetchShuffledDeck();
            return await drawCards(count);
        }

        return data.cards.map(card => ({
            value: mapCardValue(card.value),
            suit: card.suit,
            image: card.image
        }));
    } catch (error) {
        alert("Failed to draw cards. Please try again.");
        return [];
    }
}

// Map card values from API to game-friendly values
function mapCardValue(value) {
    if (['JACK', 'QUEEN', 'KING'].includes(value)) return '10';
    if (value === 'ACE') return 'A';
    return value;
}

// Play Card Shuffling Sound
function playShufflingSound() {
    const shufflingSound = new Audio('card-shuffling.mp3');
    shufflingSound.volume = 0.3;
    shufflingSound.play();
}

// Place Bet and Start Game
async function placeBet() {
    if (!gameOver) {
        alert("Finish the current game before placing a new bet!");
        return;
    }

    const betInput = document.getElementById("bet-input").value;
    currentBet = parseFloat(betInput);

    if (isNaN(currentBet) || currentBet <= 0) {
        alert("Please enter a valid bet amount.");
        return;
    }

    if (currentBet > balance) {
        alert("Insufficient balance to place this bet.");
        return;
    }

    balance -= currentBet;
    updateBalanceDisplay();

    if (!apiDeckId) {
        await fetchShuffledDeck();
    }

    await startGame();
}

// Start the Game
async function startGame() {
    gameOver = false;
    resetGameState();
    toggleButtons(true);
    togglePlaceBetButton(false);

    playerHand = await drawCards(2);
    dealerHand = await drawCards(2);

    if (!playerHand.length || !dealerHand.length) return;

    renderHands(false);
    updateScores();
    checkForInitialBlackjack();
}

// Reset Game State
function resetGameState() {
    playerHand = [];
    dealerHand = [];
    clearMessage();
}

// Update Player Score
function updateScores() {
    const playerScore = calculateScore(playerHand);
    document.getElementById("player-score").textContent = playerScore;
}

// Hit Button Functionality
async function playerHits() {
    if (gameOver) return;

    playerHand.push((await drawCards(1))[0]);
    renderHands(false);
    updateScores();

    const playerScore = calculateScore(playerHand);

    if (playerScore > 21) {
        displayMessage("Player Busts! Dealer Wins.");
        playDealerWinSound();
        revealDealerHand();
        endGame();
    }
}

// Double Down Functionality
async function doubleDown() {
    if (gameOver || balance < currentBet) {
        alert("You cannot double down at this time.");
        return;
    }

    balance -= currentBet; // Deduct the additional bet amount
    currentBet *= 2; // Double the bet
    updateBalanceDisplay();

    // Player gets one more card and their turn ends
    playerHand.push((await drawCards(1))[0]);
    renderHands(false);
    updateScores();

    const playerScore = calculateScore(playerHand);

    if (playerScore > 21) {
        displayMessage("Player Busts! Dealer Wins.");
        playDealerWinSound();
        revealDealerHand();
        endGame();
    } else {
        // Proceed directly to dealer's turn
        revealDealerHand();
        dealerPlays();
    }
}

// Stand Button Functionality
function playerStands() {
    if (gameOver) return;

    toggleButtons(false);
    revealDealerHand();
    dealerPlays();
}

// Reveal Dealer's Hidden Card
function revealDealerHand() {
    renderHands(true);
}

// Dealer's Turn
async function dealerPlays() {
    while (calculateScore(dealerHand) < 17) {
        dealerHand.push((await drawCards(1))[0]);
    }
    renderHands(true);
    determineWinner();
}

// Determine Winner
function determineWinner() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (dealerScore > 21 || playerScore > dealerScore) {
        playWinSound();
        displayMessage("Player Wins!");
        balance += currentBet * 2; // Player wins 2x their bet amount
    } else if (dealerScore === playerScore) {
        displayMessage("It's a Tie!");
        balance += currentBet; // Bet returned to balance
    } else {
        playDealerWinSound();
        displayMessage("Dealer Wins!");
    }
    updateBalanceDisplay();
    endGame();
}

// Play Sound when Player Wins
function playWinSound() {
    const winSound = new Audio('player-wins.mp3');
    winSound.volume = 0.3;
    winSound.play();
}

// Play Sound when Dealer Wins
function playDealerWinSound() {
    const dealerWinSound = new Audio('dealer-wins.mp3');
    dealerWinSound.volume = 0.3;
    dealerWinSound.play();
}

// Play Blackjack Sound
function playBlackjackSound() {
    const blackjackSound = new Audio('blackjack.mp3');
    blackjackSound.volume = 0.3;
    blackjackSound.play();
}

// Check for Blackjack on Initial Deal
function checkForInitialBlackjack() {
    const playerScore = calculateScore(playerHand);
    const dealerScore = calculateScore(dealerHand);

    if (playerScore === 21 && dealerScore === 21) {
        playBlackjackSound();
        displayMessage("It's a Tie! Both have Blackjack.");
        balance += currentBet;
        endGame();
    } else if (playerScore === 21) {
        playBlackjackSound();
        displayMessage("Player Wins with Blackjack!");
        balance += currentBet * 2.5;
        endGame();
    } else if (dealerScore === 21) {
        playBlackjackSound();
        displayMessage("Dealer Wins with Blackjack!");
        endGame();
    }
    updateBalanceDisplay();
}

// Render Hands
function renderHands(revealDealer = false) {
    renderHand("dealer-cards", dealerHand, !revealDealer);
    renderHand("player-cards", playerHand, false);
}

// Render a Single Hand
function renderHand(elementId, hand, hideFirstCard) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";

    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        if (hideFirstCard && index === 0) {
            cardDiv.classList.add("hidden");
        } else {
            const img = document.createElement("img");
            img.src = card.image;
            img.alt = `${card.value} of ${card.suit}`;
            cardDiv.appendChild(img);
        }
        container.appendChild(cardDiv);
    });
}

// Calculate Hand Score
function calculateScore(hand) {
    let score = 0;
    let aces = 0;

    hand.forEach(card => {
        if (card.value === 'A') {
            aces++;
            score += 11;
        } else {
            score += parseInt(card.value);
        }
    });

    while (score > 21 && aces > 0) {
        score -= 10;
        aces--;
    }

    return score;
}

// Update Balance Display
function updateBalanceDisplay() {
    document.getElementById("balance").textContent = balance.toFixed(2);
}

// Display Message with Timeout
function displayMessage(message) {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = message;

    if (messageTimeout) clearTimeout(messageTimeout);
    messageTimeout = setTimeout(() => {
        messageDiv.textContent = "";
    }, 7000);
}

// Clear Message
function clearMessage() {
    const messageDiv = document.getElementById("message");
    messageDiv.textContent = "";
}

// End the Game
function endGame() {
    gameOver = true;
    toggleButtons(false);
    togglePlaceBetButton(true);
    updateBalanceDisplay();
}

// Toggle Action Buttons

function toggleButtons(enable) {
    document.getElementById("surrender-button").disabled = !enable;
    
    document.getElementById("hit-button").disabled = !enable;
    document.getElementById("stand-button").disabled = !enable;
    document.getElementById("double-down-button").disabled = !enable;
}

// Toggle Place Bet Button
function togglePlaceBetButton(enable) {
    document.getElementById("place-bet-button").disabled = !enable;
}

// Initialize the Game
(async function initializeGame() {
    await fetchShuffledDeck();
    updateBalanceDisplay();

    document.getElementById("place-bet-button").addEventListener("click", placeBet);
    document.getElementById("hit-button").addEventListener("click", playerHits);
    document.getElementById("stand-button").addEventListener("click", playerStands);
    document.getElementById("double-down-button").addEventListener("click", doubleDown);
})();

// Surrender Button Functionality
function playerSurrenders() {
    if (gameOver) return;

    // Player forfeits half their bet
    balance += currentBet / 2;
    displayMessage("Player Surrendered. Half the bet is returned.");
    updateBalanceDisplay();
    endGame();
}

// Add event listener for the surrender button
document.getElementById("surrender-button").addEventListener("click", playerSurrenders);

// Flip animation for cards
function flipCard(cardElement) {
    cardElement.classList.add('card-flip');
    setTimeout(() => cardElement.classList.remove('card-flip'), 600);
}

// Apply flip animation during render
function renderHand(elementId, hand, hideFirstCard) {
    const container = document.getElementById(elementId);
    container.innerHTML = "";

    hand.forEach((card, index) => {
        const cardDiv = document.createElement("div");
        cardDiv.classList.add("card");
        if (hideFirstCard && index === 0) {
            cardDiv.classList.add("hidden");
        } else {
            const img = document.createElement("img");
            img.src = card.image;
            img.alt = `${card.value} of ${card.suit}`;
            cardDiv.appendChild(img);
        }
        container.appendChild(cardDiv);
        flipCard(cardDiv); // Add animation
    });
}
