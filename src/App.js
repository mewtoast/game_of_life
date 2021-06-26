import Game from "./game/Game";
const ASPECT_RATIO = {"4x3":4/3, "16x9":16/9, "1x1": 1}
const game =  new Game({ aspectRatio:ASPECT_RATIO["4x3"], size:10 });
game.play()
