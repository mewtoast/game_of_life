import { ALIVE, DEAD, SPEED } from '../constants';

export interface GameInput {
    size: number;
    aspectRatio: number;
    renderAt: HTMLElement;
    aliveColor?: string;
    deadColor?: string;
}

export default class Game {
    protected countSkip: number;
    protected size: number;
    protected rows: number;
    protected cols: number;
    protected height: number;
    protected width: number;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected aliveColor: string;
    protected deadColor: string;
    protected grid: number[][];
    protected playing: boolean;

    constructor({
        size,
        aspectRatio,
        renderAt,
        aliveColor = '#000000',
        deadColor = '#FFFFFF',
    }: GameInput) {
        this.countSkip = SPEED;
        this.size = size;
        this.rows = Math.floor(window.innerHeight / size);
        this.cols = Math.floor(this.rows / aspectRatio);
        this.height = this.rows * size;
        this.width = this.cols * size;
        this.canvas = document.createElement('canvas');
        // assuming we'll never get null
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.ctx = this.canvas.getContext('2d')!;
        renderAt.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.aliveColor = aliveColor;
        this.deadColor = deadColor;
        this.grid = [];
        this.playing = false;
        this.populate();
        this.renderGrid();
    }

    protected populate(): void {
        for (let i = 0; i < this.cols; i += 1) {
            const col = [];
            for (let j = 0; j < this.rows; j += 1) {
                const cellState = Math.random() > 0.5 ? ALIVE : DEAD;
                col.push(cellState);
            }
            this.grid.push(col);
        }
    }

    protected renderGrid(prevGrid?: Game['grid']): void {
        this.grid.forEach((col, i) => {
            col.forEach((state, j) => {
                const x = i * this.size;
                const y = j * this.size;
                if (!prevGrid || this.grid[i][j] !== prevGrid[i][j]) {
                    this.ctx.fillStyle = state === ALIVE ? this.aliveColor : this.deadColor;
                    this.ctx.fillRect(x, y, this.size - 1, this.size - 1);
                    // this.ctx.arc(x + this.size/2, y + this.size /2, Math.floor(this.size/2 - 1), 0, Math.PI * 2, false)
                    // this.ctx.fill()
                }
            });
        });
    }

    static getIndex(i: number, maxI: number): number {
        return (i + maxI) % maxI;
    }

    protected getLiveNeigbhorsCount(x: number, y: number): number {
        let sum = 0;
        for (let i = -1; i < 2; i += 1) {
            for (let j = -1; j < 2; j += 1) {
                const col = Game.getIndex(x + i, this.cols);
                const row = Game.getIndex(y + j, this.rows);
                const isSelf = i === 0 && j === 0;
                const isLiveNeigbhor = !isSelf && this.grid[col][row] === ALIVE;
                sum += isLiveNeigbhor ? 1 : 0;
            }
        }
        return sum;
    }

    protected getNextGridState(): Game['grid'] {
        let newGrid = this.grid.map((col, i) =>
            col.map((state, j) => {
                const liveNeighbors = this.getLiveNeigbhorsCount(i, j);
                if (liveNeighbors === 3) {
                    return ALIVE;
                }
                if (liveNeighbors < 2 || liveNeighbors > 3) {
                    return DEAD;
                }
                return state;
            })
        );
        return newGrid;
    }

    protected skipFrame(): boolean {
        this.countSkip -= 1;
        if (this.countSkip === 0) {
            this.countSkip = SPEED;
            return false;
        }
        return true;
    }

    protected gameLoop(): void {
        requestAnimationFrame(() => {
            if (!this.skipFrame()) {
                this.countSkip = SPEED;
                const prevGrid = this.grid;
                this.grid = this.getNextGridState();
                this.renderGrid(prevGrid);
            }
            if (this.playing) {
                this.gameLoop();
            }
        });
    }

    isPlaying(): boolean {
        return this.playing;
    }

    play(): void {
        if (!this.playing) {
            this.playing = true;
            this.gameLoop();
        }
    }

    pause(): void {
        this.playing = false;
    }
}
