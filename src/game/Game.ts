import { SPEED } from '../constants';

export interface GameInput {
    size: number;
    aspectRatio: number;
    renderAt: HTMLElement;
    aliveColor?: string;
    deadColor?: string;
}

type oneZero = 0 | 1;

export default class Game {
    protected countSkip: number;
    protected size: number;
    protected centerOffset: number;
    protected radius: number;
    protected rows: number;
    protected cols: number;
    protected height: number;
    protected width: number;
    protected canvas: HTMLCanvasElement;
    protected ctx: CanvasRenderingContext2D;
    protected aliveColor: string;
    protected deadColor: string;
    protected gridBuffers: [ArrayBuffer, ArrayBuffer];
    protected grids: [Int8Array, Int8Array];
    protected curr: oneZero;
    protected next: oneZero;
    protected playing: boolean;

    constructor({
        size,
        aspectRatio,
        renderAt,
        aliveColor = '#283858',
        deadColor = '#FFFFFF',
    }: GameInput) {
        this.curr = 0;
        this.next = 1;
        this.countSkip = SPEED;
        this.size = size;
        this.centerOffset = Math.ceil(size / 2);
        this.radius = Math.ceil(this.size / 4);
        const isWide = window.innerWidth > window.innerHeight;
        const smallerSideAbs = isWide ? window.innerHeight : window.innerWidth;
        const smallerSide = Math.floor(smallerSideAbs / size);
        const biggerSide = Math.floor(smallerSide * aspectRatio);
        this.rows = isWide ? smallerSide : biggerSide;
        this.cols = isWide ? biggerSide : smallerSide;
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
        this.gridBuffers = [
            new ArrayBuffer(Math.ceil((this.rows * this.cols) / 8)),
            new ArrayBuffer(Math.ceil((this.rows * this.cols) / 8)),
        ];
        this.grids = [new Int8Array(this.gridBuffers[0]), new Int8Array(this.gridBuffers[1])];
        this.playing = false;
        this.populate();
        this.renderNextGrid(true);
        this.play();
    }

    protected setBit(i: number, j: number, val: boolean): void {
        const bitIndex = j + this.rows * i;
        const index = (bitIndex / 8) | 0;
        if (val) {
            this.grids[this.next][index] |= 1 << bitIndex % 8;
        } else {
            this.grids[this.next][index] &= (1 << bitIndex % 8) ^ 0xffffffff;
        }
    }

    protected getBit(i: number, j: number, gridInd: oneZero): boolean {
        const bitIndex = j + this.rows * i;
        const index = (bitIndex / 8) | 0;
        return !!(this.grids[gridInd][index] & (1 << bitIndex % 8));
    }

    protected populate(): void {
        for (let i = 0; i < this.cols; i += 1) {
            for (let j = 0; j < this.rows; j += 1) {
                this.setBit(i, j, Math.random() > 0.7);
            }
        }
    }

    protected renderNextGrid(paintAll = false): void {
        for (let i = 0; i < this.cols; i += 1) {
            for (let j = 0; j < this.rows; j += 1) {
                const x = i * this.size;
                const y = j * this.size;
                const aliveInNext = this.getBit(i, j, this.next);
                const isDifferent = this.getBit(i, j, this.curr) !== aliveInNext;
                if (paintAll || isDifferent) {
                    this.ctx.fillStyle = aliveInNext ? this.aliveColor : this.deadColor;
                    this.ctx.fillRect(x, y, this.centerOffset, this.centerOffset);
                }
            }
        }
        this.switchGrids();
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
                const isLiveNeigbhor = !isSelf && this.getBit(col, row, this.curr);
                sum += isLiveNeigbhor ? 1 : 0;
                if (sum > 3) {
                    return sum;
                }
            }
        }
        return sum;
    }

    protected setNextGridState(): void {
        for (let i = 0; i < this.cols; i += 1) {
            for (let j = 0; j < this.rows; j += 1) {
                const liveNeighbors = this.getLiveNeigbhorsCount(i, j);
                if (liveNeighbors === 3) {
                    this.setBit(i, j, true);
                } else if (liveNeighbors < 2 || liveNeighbors > 3) {
                    this.setBit(i, j, false);
                } else {
                    this.setBit(i, j, this.getBit(i, j, this.curr));
                }
            }
        }
    }

    protected switchGrids(): void {
        this.curr = Number(!this.curr) as oneZero;
        this.next = Number(!this.next) as oneZero;
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
                this.setNextGridState();
                this.renderNextGrid();
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
