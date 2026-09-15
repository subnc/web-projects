# Tic Tac Toe

A simple and responsive two-player Tic Tac Toe game built using HTML, CSS, and JavaScript.

The project provides a clean interface, score tracking, multiple themes, and a responsive layout for desktop and mobile devices.

## Features

- Two-player Tic Tac Toe gameplay
- Player X and Player O score tracking
- Win detection
- Draw detection
- Restart the current game
- Reset complete score
- Green theme
- Blue theme
- Dark theme
- Theme preference saved using Local Storage
- Scores saved using Local Storage
- Winning cells are highlighted
- Winning animation
- Responsive design
- Keyboard-friendly controls
- Accessible game status
- No external libraries required

## How to Play

1. Player X starts the game.
2. Players take turns selecting an empty cell.
3. The first player to get three matching symbols in a row wins.
4. A winning line can be:
   - Horizontal
   - Vertical
   - Diagonal
5. If all nine cells are filled without a winner, the game ends in a draw.
6. Click **Restart Game** to start another round.

## Game Controls

### Restart Game

Clears the current board and starts a new round.

The current scores are not changed.

### Reset Score

Resets both Player X and Player O scores to zero.

### Theme

Three themes are available:

- Green
- Blue
- Dark

The selected theme is saved and restored when the page is opened again.

## Local Storage

The application uses browser Local Storage to save:

```text
ticTacToeXScore
ticTacToeOScore
ticTacToeTheme