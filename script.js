window.games = [];  // the history of games
window.game = [];  // current game, the history of positions
window.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];  // current game, the board
      // 0 = empty, 1 = player 1 played here, 2 = player 2 played here

function addMessage(text, level) {
  // Append a message in the console
  var msg = "<p class=' " + level +"'>" + text + "</p>";
  var cons = document.querySelector('.console');
  cons.innerHTML = msg + cons.innerHTML;
}

function whoIs(input) {
  // Return the player
  if (input === 1) {
    return "X";
  }
  if (input === 2) {
    return "O";
  }
  if (input === 0) {
    return "-";
  }
  if (input === 3) {
    return "-";
  }
}

function logBoard() {
  // Console log the board in human readable format
  var x = window.board;
  console.log(window.board);
  console.log(whoIs(x[0]), whoIs(x[1]), whoIs(x[2]));
  console.log(whoIs(x[3]), whoIs(x[4]), whoIs(x[5]));
  console.log(whoIs(x[5]), whoIs(x[6]), whoIs(x[7]));
}

function isGameOver() {
  // 0 1 2
  // 3 4 5
  // 6 7 8
  // Return 0, 1, 2, 3
  // 0 = not Game Over, 1 = Game Over player 1 won, 2 = Game Over player 2 won
  // 3 = a tie game
  var g = window.board;
  if(g[0] === g[1] && g[1] === g[2] && g[2] !== 0) {
    return g[0];
  }
  if(g[3] === g[4] && g[4] === g[5] && g[5] !== 0) {
    return g[3];
  }
  if(g[6] === g[7] && g[7] === g[8] && g[8] !== 0) {
    return g[6];
  }


  if(g[0] === g[3] && g[3] === g[6] && g[6] !== 0) {
    return g[0];
  }
  if(g[1] === g[4] && g[4] === g[7] && g[7] !== 0) {
    return g[1];
  }
  if(g[2] === g[5] && g[5] === g[8] && g[8] !== 0) {
    return g[2];
  }

  if(g[0] === g[4] && g[4] === g[8] && g[8] !== 0) {
    return g[0];
  }
  if(g[2] === g[4] && g[4] === g[6] && g[6] !== 0) {
    return g[2];
  }

  if(window.game.length === 9) {
    return 3;
  }

  return 0;
}

function getRandomInt(min, max) {
  // Get a random number between min and max
  addMessage("Generating random number.", "level5");
  return Math.floor(Math.random() * max) + min;
}

function lastMove() {
  // Get the order of lastest move in the game
  return window.game.length - 1;
}

function lastPosition() {
  // Get the latest position filled in the board
  return window.game[lastMove()];
}

function lastPlayer() {
  // Who moved last time?
  return lastMove() % 2 + 1;
}

function drawMove() {
  // Draw the latest move on the board (in the correct position for
  // correct player
  var text = "X";
  var player = lastPlayer();
  if (player === 2) {
    text = "O";
  }
  var position = lastPosition();
  var box = document.querySelector('.box.x' + position + '');
  box.textContent = text;
  window.board[position - 1] = player;
  addMessage("Draw move.", "level4");
}

function randomMove() {
  // Generate a move on the board (random position from 1 to 9)
  var res = getRandomInt(1, 9);
  if(window.board[res - 1] === 0) {
    return res;
  }
  return randomMove();
}

function simulateMove() {
  // Get a random move and put it on the board
  addMessage("Simulate move.", "level2");
  var move = randomMove();
  window.game.push(move);
  drawMove();
}

function humanMove(position) {
  // Record a human move
  addMessage("You moved.", "level2");
  window.game.push(position);
  drawMove();
}

function finishGame() {
  // Check the status of the game and show the message
  var status = isGameOver();
  console.log(whoIs(status));

  addMessage("Game over", "level1");
  if(status === 1) {
    addMessage("Player X won", "level1");
  }
  if(status === 2) {
    addMessage("Player O won", "level1");
  }
  if(status === 3) {
    addMessage("A tie game", "level1");
  }
}

function simulateGame() {
  // Repeat get random move until the game is finished
  addMessage("Starting game...", "level1");
  window.game = [];
  while (isGameOver() === 0) {
    simulateMove();
  }

  finishGame();
}

function clearGame() {
  // Clear the latest game
  window.game = [];
  window.board = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (var position = 1; position <= 9; position++) {
    var box = document.querySelector('.box.x' + position + '');
    box.textContent = "";
   }
}

function saveGame() {
  window.games.push(window.game);
}

function trainComputer(numberOfGames) {
  // To be used before playing with computer. It simulates a number of games,
  // saves them in the history, to be used for later better moves.
  for (var i = 0; i < numberOfGames; i++) {
    console.log("New game... The winner is:");
    simulateGame();
    logBoard();
    saveGame();
    clearGame();
  }
}

function findMove(aGame, aBoard) {
  // TODO: Check for best historical move LOL
  for (var i = 0; i < window.games.length; i++) {
    var game = window.games[i];
    var foundGames = [];
    var selected = true;
    for (var j = 0; j < aGame.length; j++) {
      if (game[j] !== aGame[j]) {
        selected = false;
      }
    }
    if (selected) {
      foundGames.push(game);
    }
  }
  console.log(foundGames);
  var bestGame = 0;  // TODO: select the best games from found
  if (foundGames.length > 0) {
    return foundGames[bestGame][aGame.length + 1];
  }
  return -1;
}

function giveMeNextMove(aGame, aBoard) {
  // Input: a started game
  // Output: next move to be played, based on games history (if something good
  // is found) or just random
  window.game = aGame;
  window.board = aBoard;
  console.log(window.game);
  var move = findMove(aGame, aBoard);
  if (move === -1) {
    console.log("No move found in history. A random one:");
    move = randomMove();
  } else {
    console.log("FOOOOOOOUNDDDDDDDDD!")
  }
  console.log(move);
}

function makeBoxesClickable() {
  // Prepare the board for human move
  for (var i = 1; i <= window.board.length; i++) {
    console.log(window.board);
    if (window.board[i - 1] === 0) {
      var box = document.querySelector('.box.x' + i + '');
      box.classList.add("clickable");
    }
  }
}

function disableBoxesClickable() {
  // Disable boxes until next move
  for (var i = 1; i <= window.board.length; i++) {
    var box = document.querySelector('.box.x' + i + '');
    box.classList.remove("clickable");
  }
}

function youMove() {
  // Human plays
  addMessage("You move!", 'level2');
  makeBoxesClickable();
}

function computerMove() {
  // Computer plays
  addMessage("Computer moves!", 'level2');
  simulateMove();
}

function gameWithComputer() {
  // Human vs Computer game
  addMessage("Starting a game with the computer!", 'level1');
  youMove();
}

document.addEventListener('click', function (event) {
  if (event.target.matches('.clickable')) {
    disableBoxesClickable();
    event.preventDefault();
    event.target.classList.forEach(
      (className) => {
        if (className[0] === "x") {
          var position = parseInt(className[1])
          humanMove(position);
          if(isGameOver() !== 0) {
            finishGame();
          } else {
            if (window.game.length < 9) {
              computerMove();
            }
            if (window.game.length < 9) {
              youMove();
            }
          }
        }
      }
    );
  }

  return;
}, false);

// Start
console.log("TRAIN =============");
trainComputer(3);
console.log("PLAY =============");
gameWithComputer();
// giveMeNextMove(
//   [1],
//   [1, 0, 0, 0, 0, 0, 0, 0, 0]
// );
