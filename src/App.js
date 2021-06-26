import Game from "./game/Game";
const ASPECT_RATIO = {"4x3":4/3, "16x9":16/9, "1x1": 1, "3x4":3/4, "9x16":9/16}
const GAME =  new Game({ aspectRatio:ASPECT_RATIO["4x3"], size:4 });
export {GAME};
GAME.play()



