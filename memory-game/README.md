# Memory Game

A simple and interactive browser-based Memory Game where players flip cards and match identical pairs.

The game includes three difficulty levels, move and mistake tracking, a timer, progress tracking, best scores, sound effects, and light/dark themes.

## Features

- Three difficulty levels
  - Easy — 4 pairs
  - Medium — 6 pairs
  - Hard — 8 pairs
- Random card shuffling
- Card flip animation
- Match and mismatch detection
- Moves counter
- Mistakes counter
- Game timer
- Progress bar
- Difficulty-specific best scores
- Best scores saved using Local Storage
- Sound effects
- Sound on/off control
- Light and dark themes
- Theme preference saved using Local Storage
- Win/completion screen
- Restart Game option
- Play Again option
- Change Difficulty option
- Responsive design
- Keyboard focus support
- Accessible card labels and controls

## How to Play

1. Open the game in a web browser.
2. Select a difficulty level.
3. Click or tap a card to reveal it.
4. Select another card.
5. If both cards match, they remain open.
6. If they do not match, they are flipped back.
7. Continue until all pairs are matched.
8. Try to complete the game with fewer moves, fewer mistakes, and a faster time.
9. Your best score is saved separately for each difficulty level.

## Difficulty Levels

| Difficulty | Pairs | Cards |
|------------|------:|------:|
| Easy | 4 | 8 |
| Medium | 6 | 12 |
| Hard | 8 | 16 |

## Scoring

The game tracks:

- **Moves** — Number of card-pair attempts.
- **Mistakes** — Number of incorrect matches.
- **Time** — Total time taken to complete the game.
- **Best** — Best saved performance for the selected difficulty.

Best scores are stored separately for Easy, Medium, and Hard modes.

## Sound

The game uses the Web Audio API to provide simple sound effects for:

- Card flips
- Correct matches
- Incorrect matches
- Game completion

Sound can be enabled or disabled using the sound control.

The sound preference is saved in Local Storage.

## Theme

The game supports:

- Light mode
- Dark mode

The selected theme is saved in Local Storage and restored when the game is opened again.

## Data Storage

The project uses browser Local Storage to save:

- Best score for each difficulty
- Sound preference
- Theme preference

No external database or backend is required.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Local Storage API
- Web Audio API

## Project Structure

```text
memory-game/
├── index.html
├── style.css
├── script.js
└── README.md