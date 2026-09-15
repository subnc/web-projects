# Hand Cricket

A simple and interactive **Hand Cricket Game** built using HTML, CSS, and JavaScript.

The game allows a player to compete against the computer through a toss, two innings, batting, bowling, wickets, target chasing, and a final match result.

## Features

- Player vs Computer
- Heads / Tails toss
- Bat First / Bowl First choice
- Two innings
- Number selection from 1 to 6
- Batting and bowling gameplay
- Wicket system
- Target calculation
- Early target completion
- Live score
- Ball count
- Match result screen
- New Match option
- Play Again option
- Pause and Resume
- Sound effects
- Sound on/off control
- Dark and light themes
- Match statistics
- Best score tracking
- Local Storage
- Custom confirmation dialogs
- Toast notifications
- Keyboard controls
- Responsive design
- Mobile-friendly interface
- Signature watermark

## How to Play

### 1. Start the Match

Click **Start Match** from the home screen.

### 2. Toss

Choose:

- Heads
- Tails

The computer randomly chooses the other side.

If you win the toss, choose:

- **Bat First**
- **Bowl First**

If the computer wins, it automatically chooses.

### 3. Batting

When batting, choose a number from **1 to 6**.

The computer also selects a number.

- If the numbers are different, your selected number is added to your score.
- If both numbers are the same, you are **OUT**.

### 4. Bowling

When bowling, choose a number from **1 to 6**.

The computer selects its batting number.

- If the numbers are different, the computer scores its selected number.
- If both numbers are the same, the computer is **OUT**.

### 5. Second Innings

After the first batter is out, the second innings begins.

The second team receives a target based on the first team's score.

The team that reaches the target first wins.

### 6. Match Result

After the second innings:

- Higher score → Win
- Lower score → Loss
- Equal score → Draw

## Game Rules

The basic rule is:

```text
Same Number = Wicket
Different Numbers = Runs