import React, { useEffect, useRef } from 'preact/compat';
import Game, { GameInput } from '../game/Game';

interface GameComponentProps extends Omit<GameInput, 'renderAt'> {
    gameRef: React.Ref<Game>;
}

export default function GameComponent({ aspectRatio, size, gameRef }: GameComponentProps) {
    const gameDiv = useRef<HTMLDivElement>(null);
    useEffect(() => {
        if (gameRef.current === null && gameDiv.current !== null) {
            // eslint-disable-next-line no-param-reassign
            gameRef.current = new Game({ aspectRatio, size, renderAt: gameDiv.current });
            // gameRef.current.canvas.classList.add 
        }
    });
    return <div className="game" ref={gameDiv} />;
}
