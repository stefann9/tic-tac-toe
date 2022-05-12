
// buttons
const resetBtn = document.querySelector('#resetBtn');
const newGameBtn = document.querySelector('#newGame');
const resetScoreBtn = document.querySelector('#resetScore');

// ul with players name, score and turn
const [p1NameDisplay,p2NameDisplay] = [document.querySelector('#p1Name'), document.querySelector('#p2Name')]
const [p1ScoreDisplay, p2ScoreDisplay] = [document.querySelector('#p1Score'), document.querySelector('#p2Score')]
const playerTurnDisplay = document.querySelector('#playerTurn')

// tic tac toe table 
const container = document.querySelector('.container');
// name the spots on the table
const [topLeft, topMid, topRight,
    midLeft, midMid, midRight,
    btmLeft, btmMid, btmRight] = container.children;
// save them in tableSpots array
const tableSpots = [topLeft, topMid, topRight,
                    midLeft, midMid, midRight,
                    btmLeft, btmMid, btmRight];


let table = []; // for keeping count of all choises
let gameOn = false;
let player1 = '';
let player2 = '';


function Player(name, symbol, turn) {
    this.name = name;
    this.score = 0;
    this.symbol = symbol;
    this.turn = turn;
}
Player.prototype.makeMarker = function (symbol) {
    // this method makes buttons use as markers
    const marker = document.createElement('button');
    // symbol for marker (X or O)
    marker.innerText = symbol
    marker.classList.add(symbol) //add the symbol class(.X or .O)
    return marker
}


// resets player.score and display score to 0
resetScoreBtn.addEventListener('click', function (event) {
    player1.score = 0;
    p1ScoreDisplay.innerText = player1.score;
    player2.score = 0;
    p2ScoreDisplay.innerText = player2.score;
})



 
function resetGame() {
    // reset table to be empty
    table = [];
    // X is first
    player1.turn = true;
    player2.turn = false;
    
    tableSpots.map((x) => {
        // remove all classes from all table spots
        x.classList.remove('X', 'O', 'winBorder');
        // remove all markers (buttons)
        x.innerText = '';
    });
    gameOn = true;
    // this prevents players to press resetBtn in the middle of the game
    resetBtn.removeEventListener('click', resetGame)
    playerMoveDisplay()
}


newGameBtn.addEventListener('click', function (event) {
    resetGame()
    player1 = new Player(prompt('Player X name?'), 'X', true);
    player2 = new Player(prompt('Player O name?'), 'O', false);
    // check for the input name
    if(player1.name === null ||player1.name === ''){
        player1.name = 'Player 1';
    }
    if(player2.name === null || player2.name === ''){
        player2.name = 'Player 2';
    }
    //display name && score
    p1NameDisplay.innerText = `${player1.name} - X`;
    p1ScoreDisplay.innerText = player1.score;
    p2NameDisplay.innerText = `${player2.name} - O`;
    p2ScoreDisplay.innerText = player2.score;
    // display player turn
    playerMoveDisplay()
})


function setPlayerTurn() {
    if (player1.turn) {
        return [player1.symbol, player1.makeMarker(player1.symbol)];
    } else {
        return [player2.symbol, player2.makeMarker(player2.symbol)];
    }
    // if player1.turn = true
    //  return [symbol = 'X', player1.makeMarker(symbol)]
}

//display turn
function playerMoveDisplay() {
    // if player1.turn = true display Is player1 turn -X
    if (player1.turn) {
        playerTurnDisplay.innerText = `Is ${player1.name} turn - X `
    } else {
        playerTurnDisplay.innerText = `Is ${player2.name} turn - O `
    }
}

// switch turn 
function nextTurn() {
    if (player1.turn === true && player2.turn === false) {
        player1.turn = false;
        player2.turn = true;
    } else {
        player1.turn = true;
        player2.turn = false;
    }
}



// main
container.addEventListener('mouseup', function (event) {
    let choice = event.target;
    if (gameOn) {

        [symbol, marker] = setPlayerTurn(); 
        // if choice = empty spot
        if (choice.classList.length < 2 && choice.tagName != 'BUTTON') {
            // choice(div) add class .X or .O
            choice.classList.add(symbol);
            // append marker(button) to that spot
            choice.append(marker)
            // keep count for the free space on the table (use for draw())
            table.push(choice);
            // update player turn and display it with playerMoveDisplay()
            nextTurn();
            playerMoveDisplay()
            // check for win or draw if so add click event for resetBtn
            if (win(symbol) || isDraw()) {
                gameOn = false;
                resetBtn.addEventListener('click', resetGame);
            }
        }
    }
})




function isDraw() {
    // if table is full display Draw! and return ture
    if (table.length === container.childElementCount) {
        // console.log("draw")
        playerTurnDisplay.innerText = `Is Draw!`
        return true;
    } else {
        return false;
    }
}


// winSpots contains all wining compinations
const winSpots = {
    top: [topLeft.classList, topMid.classList, topRight.classList],
    mid: [midLeft.classList, midMid.classList, midRight.classList],
    btm: [btmLeft.classList, btmMid.classList, btmRight.classList],

    topLeftMidBtmRight: [topLeft.classList, midMid.classList, btmRight.classList],
    btmLeftMidTopRight: [btmLeft.classList, midMid.classList, topRight.classList],

    verticalLeft: [topLeft.classList, midLeft.classList, btmLeft.classList],
    verticalMid: [topMid.classList, midMid.classList, btmMid.classList],
    verticalRight: [topRight.classList, midRight.classList, btmRight.classList],
    //this method can be use in the win or showWiningSpots function insted of (x=> x[1] === marker) 
    // winSpots.top.every(winSpots.checkSpots)
    // checkSpots: function (place) {
    //     return place[1] === marker
    // }
}
function win(marker) {
    if (winSpots.top.every(x => x[1] === marker) ||
        winSpots.mid.every(x => x[1] === marker) ||
        winSpots.btm.every(x => x[1] === marker) ||
        winSpots.topLeftMidBtmRight.every(x => x[1] === marker) ||
        winSpots.btmLeftMidTopRight.every(x => x[1] === marker) ||
        winSpots.verticalLeft.every(x => x[1] === marker) ||
        winSpots.verticalMid.every(x => x[1] === marker) ||
        winSpots.verticalRight.every(x => x[1] === marker)) {
        switch (marker) {
            case 'X':
                // update score/ add border to wining spots/ display Player wins!
                player1.score++
                p1ScoreDisplay.innerText = player1.score;
                showWiningSpots(marker)
                playerTurnDisplay.innerText = `${player1.name} wins!`
                break;
            case 'O':
                player2.score++
                showWiningSpots(marker)
                p2ScoreDisplay.innerText = player2.score;
                playerTurnDisplay.innerText = `${player2.name} wins!`
                break;
        }
        return true;
    }
}

function showWiningSpots(marker) {
// add border for wining markers
    switch (true) {
        case winSpots.top.every(x => x[1] === marker):
            winSpots.top.map(x => x.add('winBorder'))
            break;
        case winSpots.mid.every(x => x[1] === marker):
            winSpots.mid.map(x => x.add('winBorder'))
            break;
        case winSpots.btm.every(x => x[1] === marker):
            winSpots.btm.map(x => x.add('winBorder'))
            break;
        case winSpots.topLeftMidBtmRight.every(x => x[1] === marker):
            winSpots.topLeftMidBtmRight.map(x => x.add('winBorder'))
            break;
        case winSpots.btmLeftMidTopRight.every(x => x[1] === marker):
            winSpots.btmLeftMidTopRight.map(x => x.add('winBorder'))
            break;
        case winSpots.verticalLeft.every(x => x[1] === marker):
            winSpots.verticalLeft.map(x => x.add('winBorder'))
            break;
        case winSpots.verticalMid.every(x => x[1] === marker):
            winSpots.verticalMid.map(x => x.add('winBorder'))
            break;
        case winSpots.verticalRight.every(x => x[1] === marker):
            winSpots.verticalRight.map(x => x.add('winBorder'))
            break;
    }
}

