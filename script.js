// ==============================
// Memory Card Game — Student Starter (Option A)
// ==============================
// You have guided TODOs. Complete each TODO to make the game work.
// Files provided: index.html, styles.css, data/card_info.json, images/*.svg
// Open with a local server so fetch() works (e.g., VS Code Live Server).

// ------------- State & DOM refs -------------
let cards = [];
const cardTable = document.querySelector(".card-table");
let firstCard = null;
let secondCard = null;
let noFlipping = false;
let triesRemaining = 10;
let winCounter = null;

const counter = document.querySelector(".tries-remaining");
counter.textContent = triesRemaining;

// Restart without page reload (Stretch Goal)
document.getElementById('restart').addEventListener('click', () => resetGame());

// ------------- Fetch the deck -------------
fetch("./data/card_info.json")
  .then(res => res.json())
  .then(data => {
    winCounter = data.length;            // # of unique pairs to match
    cards = [...data, ...data];          // duplicate to make pairs
    const shuffled = shuffle(cards);     // TODO: implement shuffle()
    dealCards(shuffled);                 // TODO: build and attach card elements
  })
  .catch(err => console.error("Fetch error:", err));

// ------------- TODO #1: Implement Fisher-Yates shuffle -------------
//Randomizes the order of the cards so every game is different
function shuffle(arr) {
  // Goal: return a new shuffled copy of arr using Fisher–Yates (in-place) algorithm.
  // Steps:
  // 1) Copy the incoming array (to avoid mutating original).
  // 2) Loop from end -> start. For each index i, pick random j in [0, i].
  // 3) Swap elements at i and j (use destructuring).
  // 4) Return the shuffled copy.
  // Your code here ↓
  const copy = [...arr];//copying array so we dont mutate the original deck 
  // TODO: loop i from copy.length - 1 down to 1
  // TODO: generate j = Math.floor(Math.random() * (i + 1))
  // TODO: swap copy[i] and copy[j]
  for (let i = copy.length - 1; i > 0; i--) { //looping backwards
    const j = Math.floor(Math.random() * (i + 1));//picking random index 
    [copy[i], copy[j]] = [copy[j], copy[i]]; //swapping elements
  }
  return copy; // return shuffled copy
}

// ------------- TODO #2: Deal cards to the DOM -------------
function dealCards(deck) {
  // Goal: create DOM nodes for each card and append to .card-table efficiently.
  // Use a DocumentFragment. Card structure:
  // <div class="card" data-name="...">
  //   <div class="back"><img class="back-image" src="./images/<name>.svg" alt="<name>"></div>
  //   <div class="front"></div>
  // </div>
  const frag = document.createDocumentFragment();

  // TODO: for...of deck
  //   - create .card
  //   - set data-name
  //   - create .back with <img>, and .front
  //   - append back & front into .card
  //   - add click listener -> flipCard
  //   - append .card to fragment

  for (const cardData of deck) {
    const card = document.createElement('div'); //create card element
    card.classList.add('card');//add card class
    card.dataset.name = cardData.name;//set data-name

    //building the back of the card
    const back = document.createElement('div');
    back.classList.add('back');
    const img = document.createElement('img');
    img.classList.add('back-image');
    img.src = `./images/${cardData.name}.svg`;
    img.alt = cardData.name;
    back.appendChild(img);

    //building the front of the card
    const front = document.createElement('div');
    front.classList.add('front');

    //appending the back and front to the card
    card.appendChild(back);
    card.appendChild(front);

    //adding click listener
    card.addEventListener('click', flipCard);

    frag.appendChild(card);
  }

  // TODO: append fragment to cardTable
  cardTable.appendChild(frag);//appending to the grid
}

// ------------- TODO #3: Flip logic & guarding -------------
  
function flipCard() {
  // - If noFlipping is true, ignore clicks.
  // - Add class "flipped" to show the back.
  // - Prevent double-clicking the same card (if this === firstCard).
  // - If firstCard is empty, set it and return.
  // - Otherwise, set secondCard, lock (noFlipping = true), and call checkForMatch().

  // Your code here ↓
  if (noFlipping) //prevents clicking while cards are flipping
    return;
  if (this === firstCard)  //prevents double-clicking the same card
    return;
  if (this.classList.contains('flipped')) //prevents clicking the same card
     return;
  this.classList.add('flipped');//adds the class that triggers the css to reveal the back side 
  if (!firstCard) {
    firstCard = this; //sets the first card
    return;
  }
  secondCard = this; //sets the second card
  noFlipping = true; //prevents clicking while cards are flipping
  checkForMatch(); //checks if the cards match
}
 

// ------------- TODO #4: Decide match vs unflip -------------
//Decides weather the cards match or not
function checkForMatch() {
  // Compute isMatch by comparing dataset.name on firstCard and secondCard.
  // If match -> call matchCards(); else -> call unflipCards().
  // Your code here ↓
  const isMatch = firstCard?.dataset.name === secondCard?.dataset.name;
  if (isMatch) {
    matchCards();//keeps them flipped and marked them as matched 
  } else {
    unflipCards();//unflips the card and decreases the tries remaining
  }
}

// ------------- TODO #5: Handle unflip + tries + lose -------------
//handles a missmatch 
function unflipCards() {
  // After ~900ms:
  // - decrement triesRemaining; update counter text
  // - if triesRemaining === 0 -> show loss overlay (showImageOverlay()) and return
  // - otherwise remove "flipped" from both cards
  // - call resetFlags()

  // Your code here ↓
  setTimeout(() => { //after 900ms
    triesRemaining--;//decreases the tries remaining
    counter.textContent = triesRemaining;
    if (triesRemaining === 0) {//if no tries remaining
      showImageOverlay();//shows the loss overlay
      return;
    }
    firstCard.classList.remove('flipped');//removes the flipped class
    secondCard.classList.remove('flipped');
    resetFlags();//resets the flags
  }, 900);
}

// ------------- TODO #6: Handle match + win -------------
//Handles sucessful match 
function matchCards() {
  // - Decrement winCounter. If 0 -> trigger win (alert + falling stars for 5s).
  // - Remove click listeners from both cards (they should remain flipped).
  // - Set a green background on matched pairs (setCardBackground(card, "greenyellow")).
  // - Reset flags.

  // Your code here ↓
  winCounter--;//decreases the win counter
  firstCard.removeEventListener('click', flipCard);//removes the click listener
  secondCard.removeEventListener('click', flipCard);
  setCardBackground(firstCard, "greenyellow");//sets the background color
  setCardBackground(secondCard, "greenyellow");
  if (winCounter === 0) {//if all cards matched
    alert('You win!');
    const timer = setInterval(createStar, 100);//creates stars
    setTimeout(() => clearInterval(timer), 5000);//stops the stars after 5 seconds
  }
  resetFlags();
}

// Utility: set matched background color on the "back" face
function setCardBackground(card, color) {
  card.children[0].style.background = color;
}

// Reset selection/lock
function resetFlags() {
  firstCard = null; 
  secondCard = null;
  noFlipping = false;
}

// Stretch: restart game without reloading page
function resetGame() {
  // clear UI
  cardTable.innerHTML = '';
  const overlay = document.querySelector('.image-overlay');
  if (overlay) overlay.remove();
  const starWrap = document.querySelector('.star-wrapper');
  if (starWrap) starWrap.innerHTML = '';

  // reset state
  triesRemaining = 10;
  counter.textContent = triesRemaining;
  resetFlags();
  // reset win counter to number of pairs in current deck
  winCounter = Math.floor(cards.length / 2);

  // redeal
  const shuffled = shuffle(cards);
  dealCards(shuffled);
}

// ------------- TODO #7: Loss overlay -------------
//Shows the loss Overlay when the player runs out of tries 
function showImageOverlay() {
  // Create <div class="image-overlay"><img src="./images/loser.svg" alt="You lost"></div>
  // Append to body, then next frame set opacity to 1.
  // Your code here ↓
  const overlay = document.createElement('div');  //creates the overlay
  overlay.classList.add('image-overlay');
  const img = document.createElement('img');//creates the image
  img.src = './images/loser.svg';//sets the image source
  img.alt = 'You lost';
  overlay.appendChild(img);
  document.body.appendChild(overlay); //appends the overlay to the body
  requestAnimationFrame(() => {
    overlay.style.opacity = '1';//sets the opacity to 1
  });
}

// Celebration stars (provided)
function createStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  const randomX = Math.random() * window.innerWidth;
  star.style.left = `${randomX}px`;
  const duration = Math.random()*2 + 3;
  star.style.animationDuration = `${duration}s`;
  document.querySelector(".star-wrapper").appendChild(star);
  star.addEventListener('animationend', () => star.remove());
}
