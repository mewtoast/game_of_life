import { GAME } from './src/App' 

function playGame(){
    GAME.play()
}

function pauseGame(){
    GAME.pause()
}

window.pauseGame = pauseGame
window.playGame = playGame