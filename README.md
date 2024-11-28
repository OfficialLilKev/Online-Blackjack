# 🎲 Blackjack Game 🃏

Welcome to the **Blackjack Game**, a dynamic and interactive take on the classic casino card game! Whether you're a seasoned player or new to the game, this project delivers an immersive experience with exciting features and a clean, user-friendly interface.

## 📝 Features
- **Standard Gameplay Rules**: Hit, Stand, Double Down, Surrender, and Splitting options.
- **Real-Time Score Tracking**: Automatically calculates player and dealer hand values.
- **Bust Logic**: The game stops if you exceed 21 points.
- **Dealer AI**: Dealer plays by standard rules, hitting until reaching a minimum score of 17.
- **Interactive UI**: Displays cards dynamically with sleek animations.
- **Balance Management**: Start with a fixed balance, place bets, and see your winnings grow or shrink.
- **Insurance Option**: If the dealer's visible card is an Ace, players can take insurance. Insurance payouts are 2:1 if the dealer has blackjack.
- **Surrender Option**: Forfeit half your bet and end the round if needed.
- **Splitting Functionality**: Split your hand into two separate hands when dealt matching cards.

## 🔧 Technology Stack
- **HTML5**: Structuring the game layout.
- **CSS3**: Styling for a sleek, casino-like ambiance.
- **JavaScript**: Driving the gameplay logic and interactivity.
- **Deck of Cards API**: Fetching real-world card decks for authentic gameplay.

## 🚀 How to Play
1. **Place Your Bet**: Enter your desired bet amount and click "Place Bet."
2. **Make Your Move**: Hit, Stand, Double Down, Split, or Surrender based on your strategy.
3. **Insurance**: If the dealer's visible card is an Ace, choose whether to take insurance before the dealer's hidden card is revealed.
   - If the dealer has blackjack and you took insurance, you win 2:1 on your insurance bet.
   - If the dealer does not have blackjack, the game continues as normal.
4. **Beat the Dealer**: Aim to get closer to 21 than the dealer without busting.
5. **Win or Lose**: Winnings are automatically calculated based on your moves.

## 🌟 Why This Project?
This game was designed to provide a fun and educational project for developers to explore:
- **Game Development Fundamentals**: Learn about state management, user input, and AI behavior.
- **API Integration**: Fetch and manipulate real-world data using the Deck of Cards API.
- **UI/UX Design**: Create visually appealing and responsive interfaces.

## 📦 Setup and Installation
1. Clone the repository:
   ```
   git clone https://github.com/BajanVlogs/blackjack-game.git
   ```
2. Navigate to the project directory:
   ```
   cd blackjack-game
   ```
3. Open `index.html` in your browser to start playing!

## 🛠 Future Enhancements
- **Multiplayer Functionality**: Enable multiple players to compete at the same table.
- **Advanced Side Bets**: Implement options like **Perfect Pairs** or **21+3** for additional excitement.
- **Themes and Customization**: Introduce changable backgrounds to personalize the game.
- **Expanded Splitting Logic**: Support splitting beyond the initial round for hands with matching cards.
