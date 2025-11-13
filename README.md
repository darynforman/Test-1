# Memory Card Game — Student Starter

A browser-based memory matching game. Flip two cards at a time to find pairs before you run out of tries. Built with HTML, CSS, and vanilla JavaScript.

## How to Play
- Click a card to flip it, then click a second card.
- Match: both stay flipped and turn green.
- Mismatch: both flip back after a short delay and you lose a try.
- Win: match all pairs to trigger a short celebration.
- Lose: run out of tries to see a loss overlay.
- Restart: click Restart to reshuffle and redeal without reloading the page.

## Tech Stack
- HTML for structure
- CSS for layout, flip animation, overlay, and stars effect
- JavaScript for fetching data, shuffling, rendering, game state, and interactions

## Features
- Loads unique card data from JSON and duplicates into pairs
- Unbiased Fisher–Yates shuffle on a copied array
- Efficient DOM rendering via DocumentFragment
- Click-guarding to prevent double-clicks during animations
- Tries counter with loss overlay at zero
- Win celebration with falling stars (auto-cleans)
- Restart button resets the game state without a full page reload

## How It Works (Brief)
- On load, the app fetches `data/card_info.json`, duplicates the list to form pairs, shuffles it, and renders cards into `.card-table`.
- Each card stores a `data-name` attribute. Clicking flips the card by adding the `flipped` class.
- The game tracks `firstCard` and `secondCard`. When two are selected:
  - Match: remove click listeners, paint green, decrement `winCounter`, and if zero, show win celebration.
  - Mismatch: after ~900ms, decrement tries, flip both back, or if tries hit zero, show the loss overlay.
- Restart clears UI and state, then reshuffles and redeals.

## Getting Started
- Open the project with a local server so `fetch` works (e.g., VS Code Live Server).
- Navigate to `index.html`.

## File Structure
- `index.html` — HUD, card grid container, star wrapper, and script include
- `styles.css` — grid layout, flip transitions, overlay styling, stars animation
- `data/card_info.json` — list of unique cards
- `script.js` — shuffle, deal, flip logic, match/unflip handling, overlays, restart

## One Challenge I Solved
- Preventing extra clicks while two cards were flipping, which could select a third card mid-animation and corrupt state.
- Solution: a simple lock flag (`noFlipping`) temporarily blocks input between picking the second card and finishing the match/mismatch handling. After handling, flags reset so input resumes smoothly.

