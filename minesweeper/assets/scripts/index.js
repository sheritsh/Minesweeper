/* created by sheritsh // Oleg Polovinko ※ RS School / School 21, Kzn  */

function getRandInt(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

function clickSound(isSoundOn) {
  const clickSound = new Audio();
  clickSound.preload = 'auto';
  clickSound.src = 'assets/sounds/click.wav';
  clickSound.volume = 0.1;
  if (isSoundOn) {
    clickSound.play();
  }
}

function startSound(isSoundOn) {
  const startSound = new Audio();
  startSound.preload = 'auto';
  startSound.src = 'assets/sounds/start.wav';
  startSound.volume = 0.1;
  if (isSoundOn) {
    startSound.play();
  }
}

function winSound(isSoundOn) {
  const winSound = new Audio();
  winSound.preload = 'auto';
  winSound.src = 'assets/sounds/win.wav';
  winSound.volume = 0.3;
  if (isSoundOn) {
    winSound.play();
  }
}

function loseSound(isSoundOn) {
  const loseSound = new Audio();
  loseSound.preload = 'auto';
  loseSound.src = 'assets/sounds/lose.wav';
  loseSound.volume = 0.5;
  if (isSoundOn) {
    loseSound.play();
  }
}

class MinesweeperGame {
  constructor(domElement) {
    // fields
    this.x_size = 10;
    this.y_size = 10;
    this.timerCounter = 0;
    this.turnsCounter = 0;
    this.bombsAmount = 10;
    this.bombsLeftCounter = this.bombsAmount;
    this.flagsCounter = 0;
    this.gameSize = this.x_size * this.y_size;
    this.gameArray = [];
    this.isPlayable = true;
    this.isInitialized = false;
    this.isSound = true;
    this.initializeArray();
    // generate initial page elements
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('board');
    this.gameHeader = document.createElement('div');
    this.gameHeader.classList.add('header');
    this.minesLeftDisplay = document.createElement('div');
    this.minesLeftDisplay.classList.add('mines-left');
    this.minesLeftDisplay.innerHTML = this.bombsLeftCounter;
    this.flagsPlacedDisplay = document.createElement('div');
    this.flagsPlacedDisplay.classList.add('flags-placed');
    this.flagsPlacedDisplay.innerHTML = '0';
    this.movesCounterDisplay = document.createElement('div');
    this.movesCounterDisplay.classList.add('moves-counter');
    this.movesCounterDisplay.innerHTML = this.turnsCounter;
    this.gameStatusDisplay = document.createElement('div');
    this.gameStatusDisplay.classList.add('game-status');
    this.timerDisplay = document.createElement('div');
    this.timerDisplay.classList.add('timer');
    this.createTimer();
    this.settingsDisplay = document.createElement('div');
    this.settingsDisplay.classList.add('settings');
    this.gameField = document.createElement('div');
    this.gameField.classList.add('field');

    //
    domElement.append(this.gameBoard);
    this.gameBoard.append(this.gameHeader);
    this.gameHeader.append(this.minesLeftDisplay);
    this.gameHeader.append(this.flagsPlacedDisplay);

    this.gameHeader.append(this.gameStatusDisplay);
    this.gameHeader.append(this.movesCounterDisplay);
    this.gameStatusDisplay.addEventListener('click', (event) => {
      this.newGame();
    });
    this.gameHeader.append(this.timerDisplay);
    this.gameBoard.append(this.gameField);
    this.fillField();
  }

  createTimer() {
    setInterval(() => {
      this.timerDisplay.innerHTML = this.timerCounter;
    }, 1000);
    setInterval(() => {
      if (this.isPlayable && this.isInitialized) this.timerCounter++;
    }, 1000);
  }

  initializeArray() {
    for (let i = 0; i < this.y_size; i++) {
      const arr = new Array(this.x_size);
      arr.fill('0');
      this.gameArray.push(arr);
    }
    console.log(this.gameArray);
  }

  getNeigborsBombsCount(cellId) {
    console.log(cellId);
    const cellColumn = Math.floor(cellId % this.x_size);
    const cellRow = Math.floor(cellId / this.x_size);
    let bombsAroundCounter = 0;

    // console.log('Search for Y: ' + cellRow + ' X: ' + cellColumn);

    for (let i = cellRow - 1; i <= cellRow + 1; i++) {
      if (i < 0 || i > this.y_size - 1) continue;
      for (let j = cellColumn - 1; j <= cellColumn + 1; j++) {
        if (j < 0 || j > this.x_size - 1) continue;
        if (i === cellRow && j === cellColumn) continue;
        // console.log('Search for Y: ' + i + ' X: ' + j);
        if (this.gameArray[i][j] === 'b') {
          bombsAroundCounter++;
        }
      }
    }

    return bombsAroundCounter;
  }

  openAdjacentEmptyCells(cellId) {
    const curCell = document.getElementById(cellId.toString());
    if (curCell.classList.contains('cell-clicked')) return;
    const cellColumn = Math.floor(cellId % this.x_size);
    const cellRow = Math.floor(cellId / this.x_size);

    for (let i = cellRow - 1; i <= cellRow + 1; i++) {
      if (i < 0 || i > this.y_size - 1) continue;
      for (let j = cellColumn - 1; j <= cellColumn + 1; j++) {
        if (j < 0 || j > this.x_size - 1) continue;
        if (i === cellRow && j === cellColumn) continue;
        if (this.gameArray[i][j] === '0' && this.getNeigborsBombsCount(cellId) === 0) {
          const curId = i * this.x_size + j;
          curCell.classList.add('cell-clicked');
          curCell.classList.remove('cell-flag');
          curCell.classList.remove('cell');
          this.openAdjacentEmptyCells(curId);
          this.revealCell(curId);
        }
      }
    }
  }

  revealCell(id, event) {
    console.log(id);
    let clickedCell;
    if (id === null) {
      clickedCell = event.target;
    } else {
      clickedCell = document.getElementById(id.toString());
    }

    if (!this.isInitialized) {
      this.generateGameAray(clickedCell);
      this.isInitialized = true;
    }

    // if (clickedCell.classList.contains('cell-flag')) return;
    if (event && !clickedCell.classList.contains('cell-clicked')) {
      this.turnsCounter++;
      if (id === null) {
        setTimeout(() => {
          if (this.isPlayable) clickSound(this.isSound);
        }, 50);
      }
    }
    const clickedCellId = clickedCell.getAttribute('id');
    const cellColumn = Math.floor(clickedCellId % this.x_size);
    const cellRow = Math.floor(clickedCellId / this.x_size);

    if (this.gameArray[cellRow][cellColumn] === 'b') {
      clickedCell.classList.add('cell-bomb');
      // TO DO: GAME OVER;
      this.gameOver();
      clickedCell.style.backgroundColor = 'red';
    } else {
      // clickedCell.classList.add('cell-clicked');
      const bombsAroundConter = this.getNeigborsBombsCount(clickedCellId);
      if (bombsAroundConter > 0) {
        clickedCell.classList.remove('cell-flag');
        clickedCell.classList.add('cell-clicked');
        clickedCell.classList.remove('cell');
      }
      switch (bombsAroundConter) {
        case 1:
          clickedCell.classList.add('cell-one');
          break;
        case 2:
          clickedCell.classList.add('cell-two');
          break;
        case 3:
          clickedCell.classList.add('cell-three');
          break;
        case 4:
          clickedCell.classList.add('cell-four');
          break;
        case 5:
          clickedCell.classList.add('cell-five');
          break;
        case 6:
          clickedCell.classList.add('cell-six');
          break;
        case 7:
          clickedCell.classList.add('cell-seven');
          break;
        case 8:
          clickedCell.classList.add('cell-eight');
          break;
        default:
          this.openAdjacentEmptyCells(clickedCellId);
          break;
      }
    }

    // TO DO: check state (flags and bombs to win) SET TIMER TO FIRST MOVE
    // this.updateState();
    this.checkEnd();
  }

  updateState() {
    this.minesLeftDisplay.innerHTML = this.bombsLeftCounter;
    this.flagsPlacedDisplay.innerHTML = this.bombsAmount - this.bombsLeftCounter;
    this.movesCounterDisplay.innerHTML = this.turnsCounter;
  }

  fillField() {
    for (let i = 0; i < this.gameSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', i.toString());
      cell.addEventListener('click', (event) => {
        if (!cell.classList.contains('cell-flag') && this.isPlayable) {
          this.revealCell(null, event);
        }
      });
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (!cell.classList.contains('cell-clicked') && this.isPlayable) {
          cell.classList.toggle('cell-flag');
          cell.classList.toggle('cell');
          if (cell.classList.contains('cell-flag')) {
            this.flagsCounter++;
            this.bombsLeftCounter--;
          } else {
            this.flagsCounter--;
            this.bombsLeftCounter++;
          }
          this.updateState();
        }
        // TO DO: function to handle flag placement
      });
      this.gameField.append(cell);
    }
  }

  generateGameAray(clickedCell) {
    const clickedCellId = clickedCell.getAttribute('id');
    const clickedCellColumn = Math.floor(clickedCellId % this.x_size);
    const clickedCellRow = Math.floor(clickedCellId / this.x_size);

    let unplacedBombs = this.bombsAmount;

    while (unplacedBombs) {
      let randXInt = getRandInt(0, this.x_size - 1);
      let randYInt = getRandInt(0, this.y_size - 1);
      console.log('Y: ' + randYInt + ' X: ' + randXInt);
      console.log(this.gameArray[randYInt][randXInt]);
      if (
        this.gameArray[randYInt][randXInt] !== 'b' &&
        (randYInt !== clickedCellRow || randXInt !== clickedCellColumn)
      ) {
        this.gameArray[randYInt][randXInt] = 'b';
        unplacedBombs--;
      }
    }

    console.log(this.gameArray);
  }

  newGame() {
    startSound(this.isSound);
    this.timerCounter = 0;
    this.turnsCounter = 0;
    this.flagsCounter = 0;
    this.isPlayable = true;
    this.bombsLeftCounter = this.bombsAmount;
    this.gameArray = [];
    this.isInitialized = false;
    this.initializeArray();
    this.gameField.innerHTML = '';
    this.fillField();
    this.gameStatusDisplay.classList.remove('game-status-died');
    this.gameStatusDisplay.classList.remove('game-status-win');
    this.gameStatusDisplay.classList.add('game-status');
    this.timerDisplay.innerHTML = '0';
    this.updateState();
  }

  checkEnd() {
    let clickedToWin = this.gameSize - this.bombsAmount;
    let placedFlagsCounter = 0;
    console.log('To win: ' + clickedToWin);

    for (let i = 0; i < this.y_size; i++) {
      for (let j = 0; j < this.x_size; j++) {
        const currentid = i * this.x_size + j;
        const currentCell = document.getElementById(currentid.toString());
        if (currentCell.classList.contains('cell-clicked')) {
          clickedToWin--;
        }

        if (currentCell.classList.contains('cell-flag')) {
          placedFlagsCounter++;
        }
      }
    }
    console.log('now to win: ' + clickedToWin);
    this.placedFlags = placedFlagsCounter;
    this.bombsLeftCounter = this.bombsAmount - this.placedFlags;
    if (clickedToWin === 0) {
      this.gameWin();
    } else {
      this.updateState();
    }
  }

  gameWin() {
    winSound(this.isSound);
    this.isPlayable = false;
    this.gameStatusDisplay.classList.remove('game-status');
    this.gameStatusDisplay.classList.add('game-status-win');
  }

  gameOver() {
    loseSound(this.isSound);
    this.isPlayable = false;
    this.gameStatusDisplay.classList.remove('game-status');
    this.gameStatusDisplay.classList.add('game-status-died');

    for (let i = 0; i < this.y_size; i++) {
      for (let j = 0; j < this.x_size; j++) {
        const currentid = i * this.x_size + j;
        const currentCell = document.getElementById(currentid.toString());
        if (this.gameArray[i][j] === 'b') {
          currentCell.classList.add('cell-clicked');
          currentCell.classList.add('cell-bomb');
        }
      }
    }
  }
}

const gameWrapper = document.createElement('div');
gameWrapper.classList.add('wrapper');
document.body.append(gameWrapper);
const gameTitle = document.createElement('h1');
gameTitle.textContent = 'Minesweeper';
gameWrapper.append(gameTitle);

const game = new MinesweeperGame(gameWrapper);
// game.fillField();
