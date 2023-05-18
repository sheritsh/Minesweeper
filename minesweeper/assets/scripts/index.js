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
    this.gameArray = new Array(this.gameSize);
    this.gameArray.fill('0');
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

  fillField() {
    for (let i = 0; i < this.gameSize; i++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.setAttribute('id', i.toString());
      this.gameField.append(cell);
    }
  }

  generateGameAray() {
    let unplacedBombs = this.bombsAmount;

    for (let i = 0; unplacedBombs; i++) {
      let randInt = getRandInt(0, this.gameSize - 1);
      console.log(randInt);
      if (this.gameArray[randInt] !== 'b') {
        this.gameArray[randInt] = 'b';
        unplacedBombs--;
      }
      console.log(this.gameArray[randInt]);
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
game.fillField();
game.generateGameAray();
console.log(game.gameArray);
