const board = document.querySelector('.board');
const startButton = document.querySelector('.start-button');
const restartButton = document.querySelector('.restart-button');
const startScreen = document.querySelector('.start');
const gameOverScreen = document.querySelector('.game-over');

const blockHeight = 30;
const blockWidth = 30;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;

board.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
board.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

const blocks = [];
let snake = [{
    x: 5, y: 10
}]
let food = {
    x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)
}
let score = 0;
let highScore = JSON.parse(localStorage.getItem('gameData')).score || 0;
let time = `00-00`;

document.querySelector('#high-score').innerHTML = `${highScore}`;

//load grid/board
for(let row = 0; row < rows; row++) {
    
    for(let col = 0; col < cols; col++) {
        const block = document.createElement('div');
        block.classList.add("block");
        block.classList.add('border', 'border-white', 'rounded-2xl');
        board.appendChild(block);

        blocks[`${row}-${col}`] = block;
    }
}

//render snake and food
function render() {
    let head = null;
    let tail = null;

    blocks[`${food.x}-${food.y}`].style.backgroundColor = '#ff0000';

    if(direction === "left") {
        head = {x: snake[0].x, y: snake[0].y - 1}
    }

    else if(direction === "right") {
        head = {x: snake[0].x, y: snake[0].y + 1}
    }

    else if(direction === "up") {
        head = {x: snake[0].x - 1, y: snake[0].y}
    }
    
    else if(direction === "down") {
        head = {x: snake[0].x  + 1, y: snake[0].y}
    }

    //wall collision
    if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {

        if(score > highScore) {
            highScore = score;

            const highRecord = {score: highScore};
            localStorage.setItem('gameData', JSON.stringify(highRecord));
            
        }
        
        score = 0;
        time = `00-00`;
        document.querySelector('#time').innerHTML = `${time}`;
        document.querySelector('#score').innerHTML = `${score}`;
        document.querySelector('#high-score').innerHTML = `${highScore}`;

        clearInterval(intervalId);
        clearInterval(timeIntervalId);
        gameOverScreen.style.display = "flex";
        return;
    }

    if(head.x === food.x && head.y === food.y) {
        blocks[`${food.x}-${food.y}`].style.backgroundColor = '';
        food = {x: Math.floor(Math.random() * rows), y: Math.floor(Math.random() * cols)};

        snake.unshift(head);
        score++;
        document.querySelector('#score').innerHTML = `${score}`;

    }

    snake.forEach((body) => {
        blocks[`${body.x}-${body.y}`].style.backgroundColor = '';
    })

    snake.unshift(head);
    snake.pop();


    snake.forEach(body => {
        blocks[`${body.x}-${body.y}`].style.backgroundColor = '#aaff00';
    })
}


//taking direction input
let direction = "down";
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp')    direction = "up";
    if (e.key === 'ArrowDown')  direction = "down";
    if (e.key === 'ArrowLeft')  direction = "left";
    if (e.key === 'ArrowRight') direction = "right";
})

//start game 
startButton.addEventListener('click', () => {
    startScreen.style.display = "none";

    intervalId = setInterval(() => {
    render();

    }, 100); 

    timeIntervalId = setInterval(() => {
        let [ min, sec ] = time.split("-").map(Number);

        if(sec == 59) {
            min += 1;
            sec = 0;
        } else {
            sec += 1;
        }

        time = `${min}-${sec}`;
        document.querySelector('#time').innerHTML = time;
    }, 1000)
})

function restartGame() {
    document.querySelector('#high-score').innerHTML = `${highScore}`;

    blocks[`${food.x}-${food.y}`].style.backgroundColor = '';
    snake.forEach((body) => {
        blocks[`${body.x}-${body.y}`].style.backgroundColor = '';
    })


    gameOverScreen.style.display = "none";
    snake = [{
        x: 5, y: 10
    }]
    food = {
        x: Math.floor(Math.random()*rows), y: Math.floor(Math.random()*cols)
    }

    intervalId = setInterval(() => {
    
    render();
    }, 100); 
}

restartButton.addEventListener('click', restartGame);