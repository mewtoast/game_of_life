import React, { useRef, render } from 'preact/compat';
import GameComponent from './components/GameComponent';
import Game from './game/Game';

const ASPECT_RATIO = { '4x3': 4 / 3, '16x9': 16 / 9, '1x1': 1, '3x4': 3 / 4, '9x16': 9 / 16 };

function App() {
    const game = useRef<Game>(null);
    const togglePlay = () => {
        if (game.current) {
            if (game.current.isPlaying()) {
                game.current.pause();
            } else {
                game.current.play();
            }
        }
    };
    return (
        <div className="app">
            <div className="settings" />
            <div className="game-holder" onClick={() => togglePlay()}>
                <GameComponent aspectRatio={ASPECT_RATIO['4x3']} size={4} gameRef={game} />
            </div>
        </div>
    );
}

render(<App  />, document.body);
