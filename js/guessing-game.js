function generateWinningNumber() {
  return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
  let end = arr.length;
  while (end) {
    let i = Math.floor(Math.random() * end--);
    let temp = arr[end];
    arr[end] = arr[i];
    arr[i] = temp;
  }
  return arr;
}

class Game {
  constructor() {
    this.winningNumber = generateWinningNumber();
    this.playersGuess = null;
    this.pastGuesses = [];
    this.gameLost = false;
  }

  difference() {
    return Math.abs(this.playersGuess - this.winningNumber);
  }

  isLower() {
    return this.playersGuess < this.winningNumber;
  }

  playersGuessSubmission(num) {
    if (num < 1 || num > 100 || isNaN(num)) return `That is an invalid guess. Please enter a number between 1 and 100`;
    this.playersGuess = num;
    return this.checkGuess();
  }

  checkGuess() {
    if (this.playersGuess == this.winningNumber) {
      this.updateUI();
      return 'You Win!';
    }
    else if (this.pastGuesses.includes(this.playersGuess))
      return 'You have already guessed that number.';
    else this.pastGuesses.push(this.playersGuess);

    //Programatically create HTML elements for guesses
    let li = document.createElement('li');
    let node = document.createTextNode(this.playersGuess);
    let differenceValue = this.difference();
    //assign color of the guess according to thhe difference value
    li.style.background = `rgb(255, ${differenceValue*3}, ${differenceValue*2})`;
    li.appendChild(node);
    let parent = document.getElementById('list');
    parent.appendChild(li);

    if (this.pastGuesses.length === 5) {
      this.updateUI();
      return `You Lose. The number was ${this.winningNumber}.`;
    }
    else {
      let lowerMessage = '';
      let lower = this.isLower();
      if (lower) {
        lowerMessage = ' Guess higher!';
      } else {
        lowerMessage = ' Guess lower!';
      }
      //using differenceValue from earlier
      if (differenceValue < 10) return `You're burning up!` + lowerMessage;
      else if (differenceValue < 25) return `You're lukewarm.` + lowerMessage;
      else if (differenceValue < 50) return `You're a bit chilly.` + lowerMessage;
      else return `You're ice cold!` + lowerMessage;
    }
  }

  provideHint() {
    //Two phony 'winning' numbers
    let firstR = generateWinningNumber();
    let secondR = generateWinningNumber();
    let thirdR = generateWinningNumber();
    let fourthR = generateWinningNumber();
    let fifthR = generateWinningNumber();
    let sixthR = generateWinningNumber();
    let arr = [this.winningNumber, firstR, secondR, thirdR, fourthR, fifthR, sixthR];
    return shuffle(arr);
  }

  updateUI() {
    let textField = document.getElementById('num-input');
    textField.disabled = true;
    let submitButton = document.getElementById('submit-button');
    submitButton.disabled = true;
  }
}

function newGame() {
  return new Game();
}

function playGame() {
  const game = newGame();

  let button = document.getElementById('submit-button');
  button.addEventListener('click', function() {
    let numEntry = document.querySelector('input');
    let newMessage = `You guessed ${numEntry.value}! ${game.playersGuessSubmission(numEntry.value)}`;
    let message = document.getElementById('message');
    message.innerHTML = newMessage;
    numEntry.value = '';
  });

  let newGameButton = document.getElementById('new-game-button');
  newGameButton.addEventListener('click', function() {
    location.reload();
  });

  let hintButton = document.getElementById('hint-button');
  hintButton.addEventListener('click', function() {
    let message = document.getElementById('message');
    message.innerHTML = `The number is one of the following: ${game.provideHint().join(', ')}`;
    hintButton.addEventListener('click', function() {
      message.innerHTML = 'You already used your hint!';
    })
  });
}

playGame();
