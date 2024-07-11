document.addEventListener("DOMContentLoaded", () => {
  const gameContainer = document.createElement("div");
  gameContainer.className = "game";

  const hangmanBox = document.createElement("div");
  hangmanBox.className = "hangman-box";
  const hangmanImage = document.createElement("img");
  hangmanImage.src = "./assets/img/hangman-0.svg";
  hangmanImage.alt = "Hangman Image";
  hangmanBox.appendChild(hangmanImage);

  const wordDisplay = document.createElement("div");
  wordDisplay.className = "word-display";

  const hintContainer = document.createElement("div");
  hintContainer.className = "hint";
  hintContainer.innerHTML = "<b>Hint:</b>";

  const keyboardDiv = document.createElement("div");
  keyboardDiv.className = "keyboard";

  const guessesText = document.createElement("div");
  guessesText.className = "guesses";
  guessesText.innerText = "0 / 6";

  gameContainer.appendChild(hangmanBox);
  gameContainer.appendChild(wordDisplay);
  gameContainer.appendChild(hintContainer);
  gameContainer.appendChild(keyboardDiv);
  gameContainer.appendChild(guessesText);
  document.body.appendChild(gameContainer);

  // Використовуємо wordList з word-list.js
  const words = wordList;

  let currentWord = "";
  let currentHint = "";
  let guessedLetters = [];
  let wrongGuesses = 0;

  function startGame() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex].word.toLowerCase();
    currentHint = words[randomIndex].hint;
    guessedLetters = [];
    wrongGuesses = 0;
    guessesText.innerText = `${wrongGuesses} / 6`;
    hangmanImage.src = `./assets/img/hangman-${wrongGuesses}.svg`;

    wordDisplay.innerHTML = currentWord
      .split("")
      .map((letter) => `<span class="letter">_</span>`)
      .join("");

    hintContainer.innerHTML = `<b>Hint:</b> ${currentHint}`;

    createKeyboard();
  }

  function createKeyboard() {
    keyboardDiv.innerHTML = "";

    const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
    const firstRow = alphabet.slice(0, 13);
    const secondRow = alphabet.slice(13, 26);

    const firstRowDiv = document.createElement("div");
    firstRowDiv.className = "keyboard-row";
    firstRow.forEach((letter) => {
      const button = document.createElement("button");
      button.innerText = letter;
      button.addEventListener("click", () => handleGuess(letter));
      firstRowDiv.appendChild(button);
    });

    const secondRowDiv = document.createElement("div");
    secondRowDiv.className = "keyboard-row";
    secondRow.forEach((letter) => {
      const button = document.createElement("button");
      button.innerText = letter;
      button.addEventListener("click", () => handleGuess(letter));
      secondRowDiv.appendChild(button);
    });

    keyboardDiv.appendChild(firstRowDiv);
    keyboardDiv.appendChild(secondRowDiv);
  }

  function handleGuess(letter) {
    if (guessedLetters.includes(letter) || wrongGuesses >= 6) return;

    guessedLetters.push(letter);
    const buttons = document.querySelectorAll("button");
    buttons.forEach((button) => {
      if (button.innerText === letter) {
        button.disabled = true;
        button.classList.add(
          currentWord.includes(letter) ? "correct" : "incorrect"
        );
      }
    });

    if (currentWord.includes(letter)) {
      const letters = document.querySelectorAll(".letter");
      currentWord.split("").forEach((char, index) => {
        if (char === letter) {
          letters[index].innerText = char;
        }
      });

      if (Array.from(letters).every((span) => span.innerText !== "_")) {
        showModal("You Won!", "Congratulations! You guessed the word.");
      }
    } else {
      wrongGuesses++;
      guessesText.innerText = `${wrongGuesses} / 6`;
      hangmanImage.src = `./assets/img/hangman-${wrongGuesses}.svg`;

      if (wrongGuesses === 6) {
        showModal("Game Over", `The word was: ${currentWord}`);
      }
    }
  }

  function showModal(title, message) {
    const modal = document.createElement("div");
    modal.className = "modal";

    const modalContent = document.createElement("div");
    modalContent.className = "modal-content";

    const modalTitle = document.createElement("h2");
    modalTitle.innerText = title;

    const modalMessage = document.createElement("p");
    modalMessage.innerText = message;

    const restartButton = document.createElement("button");
    restartButton.innerText = "Restart";
    restartButton.addEventListener("click", () => {
      document.body.removeChild(modal);
      startGame();
    });

    modalContent.appendChild(modalTitle);
    modalContent.appendChild(modalMessage);
    modalContent.appendChild(restartButton);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);

    setTimeout(() => {
      modal.classList.add("visible");
    }, 10);
  }

  document.addEventListener("keydown", (event) => {
    const letter = event.key.toLowerCase();
    if (/^[a-z]$/.test(letter)) {
      handleGuess(letter);
    }
  });

  startGame();
});
