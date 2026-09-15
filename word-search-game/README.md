# Word Search Game

A simple and interactive **Word Search Game** built using HTML, CSS, and JavaScript.

Find all the hidden words in the letter grid as quickly as possible. The game supports multiple difficulty levels, scoring, best records, sound effects, pause/resume, dark/light mode, and responsive design.

## Features

- Easy, Medium, and Hard difficulty levels
- Randomly generated word-search grids
- Random word placement in 8 directions
- Horizontal, vertical, and diagonal words
- Forward and reverse word detection
- Mouse and touch selection
- Score calculation with speed bonus
- Timer
- Pause and Resume
- Best score tracking
- Best time tracking
- Games played and completed statistics
- Completion rate
- Progress indicator
- Sound effects
- Sound on/off control
- Dark and light themes
- How to Play instructions
- Completion result screen
- New Game and Play Again options
- Responsive design for mobile and desktop
- Local Storage support
- Keyboard shortcuts
- Accessible grid and controls

## Difficulty Levels

| Difficulty | Grid Size | Words |
|------------|-----------|-------|
| Easy | 8 × 8 | 5 |
| Medium | 10 × 10 | 8 |
| Hard | 12 × 12 | 12 |

## How to Play

1. Select a difficulty level.
2. Click **Start Game**.
3. Find the words shown in the word list.
4. Click and drag across a word.
5. Words can appear horizontally, vertically, diagonally, forwards, or backwards.
6. Correctly found words are highlighted.
7. Continue until all words are found.
8. Try to achieve the highest score and fastest time.

### Touch Controls

On mobile devices, touch and drag across the letters to select a word.

### Keyboard Controls

- **Space** — Pause / Resume
- **Escape** — Close the instructions modal

## Scoring

Each correctly found word gives points based on its length.

### Base Score

```text
Word Score = Word Length × 10