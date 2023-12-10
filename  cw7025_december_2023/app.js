const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.score')

const lifeDisplay = document.querySelector('.lives')
let currentShooterIndex = 217
let life = 3
let currentinLaserIndex = 8

let direction = 1
let invadersId
let goingRight = true
let aliensRemoved = []
let results = 0

let directionX = 1;


$(document).ready(function () {
    var container = $('.game-container');
    var player = new Player(280, 540, 40, 40, 40, container);
    setInterval(function () {
        player.move();
        /* goodBullet.shoot(player.x, player.y, player.width);*/

    }, 16);
    $(document).keydown(function (e) {
        if (e.which === 37) {
            player.moveLeft();
        } else if (e.which === 39) {
            player.moveRight();
        } else if (e.which === 32) {
            /*  goodBullet.isShooting = true;*/
            shoot();

        }
    });

    $(document).keyup(function (e) {
        if (e.which === 37 || e.which === 39) {
            // Left or right arrow key released
            player.stop();
        }
    });
});



for (let i = 0; i < 225; i++) {
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))
const width = 15
const alienInvaders = creatInvader(5,8,15)

function draw() {
    for (let i = 0; i < alienInvaders.length; i++) {
        if (!aliensRemoved.includes(i)) {
            squares[alienInvaders[i]].classList.add('invader')
        }
    }
}



draw()

function remove() {
    for (let i = 0; i < alienInvaders.length; i++) {
        squares[alienInvaders[i]].classList.remove('invader')
    }
}



function moveInvaders() {


    const leftEdge = alienInvaders[0] % width === 0
    const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1
    remove()

    if (rightEdge && goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width + 1
            direction = -1
            goingRight = false
        }
    }

    if (leftEdge && !goingRight) {
        for (let i = 0; i < alienInvaders.length; i++) {
            alienInvaders[i] += width - 1
            direction = 1
            goingRight = true
        }
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        alienInvaders[i] += direction
    }

    draw()

    if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(invadersId)
    }

    for (let i = 0; i < alienInvaders.length; i++) {
        if (alienInvaders[i] > (squares.length)) {
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(invadersId)
        }
    }
    if (aliensRemoved.length === alienInvaders.length) {
        resultsDisplay.innerHTML = 'YOU WIN'
        clearInterval(invadersId)
    }

}



function moveinv() {


    if (currentinLaserIndex <= 224) {
        squares[currentinLaserIndex].classList.remove('invaderlaser')
        currentinLaserIndex += width
        if (currentinLaserIndex > 224) {
            currentinLaserIndex = alienInvaders[Math.floor(Math.random() * alienInvaders.length)]
            squares[currentinLaserIndex].classList.add('invaderlaser')
        }
        else {
            if (!squares[currentinLaserIndex].classList.contains('invader')) {
                squares[currentinLaserIndex].classList.add('invaderlaser');
            } 
            
        }
        if (currentinLaserIndex == currentShooterIndex) {
            squares[currentinLaserIndex].classList.remove('invaderlaser')


            life = life - 1
            if (life <= 0) {
                life = 0
                resultsDisplay.innerHTML = 'GAME OVER'

            }
            lifeDisplay.innerHTML = life
         
            
        }
       
    }


}

invadersId = setInterval(moveInvaders, 1800)
invaderlaserId = setInterval(moveinv, 100)

function shoot() {
    if (life > 0) {
        let laserId
        let currentLaserIndex = currentShooterIndex
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser')
            currentLaserIndex -= width
            squares[currentLaserIndex].classList.add('laser')

            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser')
                squares[currentLaserIndex].classList.remove('invader')

                clearInterval(laserId)

                const alienRemoved = alienInvaders.indexOf(currentLaserIndex)
                aliensRemoved.push(alienRemoved)
                results = results + 10
                resultsDisplay.innerHTML = results
                console.log(aliensRemoved)

            }

        }

        laserId = setInterval(moveLaser, 100)
    }
    

}

function creatInvader(rows, cols, width) {
    const Invader = [];
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            var invaderindex = col + row * width;
            Invader.push(invaderindex);
        }
    }
    return Invader;
}
class Player {
    constructor(x, y, speed, width, height, container) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.direction = 0;
        this.width = width;
        this.height = height;
        this.container = container;
        this.containerLeft = parseInt(container.css('left'));
        this.containerRight = this.containerLeft + parseInt(container.width());
        this.element = $('.shooter');
    }

    moveLeft() {
        this.direction = -1;
      
    }
    moveRight() {
        this.direction = 1;
      
    }
    stop() {
        this.direction = 0;
    }
    move() {
        if (life <= 0) {
            this.stop();
            $('.shooter').remove();
        }
        if (this.direction === -1 && this.x > this.containerLeft) {
            this.x -= this.speed;
            currentShooterIndex--;
            console.log(currentShooterIndex);
            this.stop();
        } else if (this.direction === 1 && this.x + this.width < this.containerRight) {
            this.x += this.speed;
            currentShooterIndex++;
            console.log(currentShooterIndex);
            this.stop();
        }
        this.element.css('left', this.x + 'px');
        this.element.css('top', this.y + 'px');
    }
}


