/* created by sheritsh // Oleg Polovinko ※ RS School / School 21, Kzn  */

function getRandInt(min, max) {
  let rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
}

class MinesweeperGame {
  constructor(domElement) {
    // fields
    this.x_size = 10;
    this.y_size = 10;
    this.timerCounter = 0;
    this.turnsCounter = 0;
    this.bombsAmount = 10;
    this.bombsLeftCounter = 0;
    this.flagsCounter = 0;
    this.gameSize = this.x_size * this.y_size;
    this.gameArray = [];
    this.initializeArray();
    this.generateGameAray();
    // generate initial page elements
    this.gameBoard = document.createElement('div');
    this.gameBoard.classList.add('board');
    this.gameHeader = document.createElement('div');
    this.gameHeader.classList.add('header');
    this.gameField = document.createElement('div');
    this.gameField.classList.add('field');

    //
    domElement.append(this.gameBoard);
    this.gameBoard.append(this.gameHeader);
    this.gameBoard.append(this.gameField);
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

  openEmptyNeigbors(cellId) {
    const cellColumn = Math.floor(cellId % this.x_size);
    const cellRow = Math.floor(cellId / this.x_size);

    for (let i = cellRow - 1; i <= cellRow + 1; i++) {
      if (i < 0 || i > this.y_size - 1) continue;
      for (let j = cellColumn - 1; j <= cellColumn + 1; j++) {
        if (j < 0 || j > this.x_size - 1) continue;
        if (i === cellRow && j === cellColumn) continue;
        if (this.gameArray[i][j] === '0' && this.getNeigborsBombsCount(cellId) === 0) {
          const curCell = document.getElementById(cellId.toString());
          const curId = i * this.x_size + j;
          curCell.classList.add('cell-clicked');
          // this.openEmptyNeigbors(curId);
          // setTimeout(() => {
          //   this.openEmptyNeigbors(curId);
          // }, 1000);
        }
      }
    }
  }

  revealCell(event) {
    const clickedCell = event.target;
    const clickedCellId = clickedCell.getAttribute('id');
    const cellColumn = Math.floor(clickedCellId % this.x_size);
    const cellRow = Math.floor(clickedCellId / this.x_size);

    if (this.gameArray[cellRow][cellColumn] === 'b') {
      clickedCell.classList.add('cell-bomb');
    } else {
      // clickedCell.classList.add('cell-clicked');
      switch (this.getNeigborsBombsCount(clickedCellId)) {
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
          this.openEmptyNeigbors(clickedCellId);
          break;
      }
    }
  }

  fillField() {
    for (let i = 0; i < this.gameSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', i.toString());
      cell.addEventListener('click', (event) => {
        this.revealCell(event);
      });
      cell.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        cell.classList.add('cell-flag');
        // TO DO: function to handle flag placement
      });
      this.gameField.append(cell);
    }
  }

  generateGameAray() {
    let unplacedBombs = this.bombsAmount;

    while (unplacedBombs) {
      let randXInt = getRandInt(0, this.x_size - 1);
      let randYInt = getRandInt(0, this.y_size - 1);
      console.log('Y: ' + randYInt + ' X: ' + randXInt);
      console.log(this.gameArray[randYInt][randXInt]);
      if (this.gameArray[randYInt][randXInt] !== 'b') {
        this.gameArray[randYInt][randXInt] = 'b';
        unplacedBombs--;
      }
    }

    console.log(this.gameArray);
  }
}

const gameWrapper = document.createElement('div');
gameWrapper.classList.add('wrapper');
document.body.append(gameWrapper);
const gameTitle = document.createElement('h1');
gameTitle.textContent = 'Minesweeper';
gameWrapper.append(gameTitle);

const game = new MinesweeperGame(gameWrapper);
game.fillField();
// game.generateGameAray();
