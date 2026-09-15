# Chopsticks Game

A simple and interactive two-player Chopsticks hand game built using HTML, CSS, and JavaScript.

## About

Chopsticks is a two-player hand game where players use the fingers on their hands to attack their opponent.

Each player starts with one finger on each hand. Players take turns attacking their opponent's hands until both hands of one player become inactive.

This project provides a clean, responsive, and beginner-friendly implementation of the game.

## Features

- Two-player gameplay
- Hand-based attack system
- Finger count from 0 to 4
- Inactive hand detection
- Split hands feature
- Turn indicator
- Active player highlighting
- Attack animation
- Win detection
- Restart game
- Professional light theme
- Dark theme
- Theme preference saved using Local Storage
- Responsive design
- Keyboard-friendly controls
- Simple and accessible interface

## Game Rules

1. Each player starts with one finger on each hand.
2. On a turn, select one of your live hands.
3. Select one of the opponent's live hands.
4. The target hand receives the total of both hand values.
5. If the total reaches 5 or more, the target hand becomes inactive.
6. An inactive hand cannot attack.
7. A player can split their fingers between both hands when a valid split is possible.
8. The first player to make both opponent hands inactive wins.

## Split Rule

The split feature redistributes the fingers between the player's two hands while keeping the same total number of fingers.

Examples:

- `3 + 1` → `2 + 2`
- `3 + 0` → `1 + 2`
- `4 + 0` → `2 + 2`

The Split Hands button is available only when a meaningful split can be made.

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Local Storage

## Project Structure

```text
chopsticks-game/
│
├── index.html
├── style.css
├── script.js
└── README.md