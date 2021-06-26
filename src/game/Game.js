import { ALIVE, DEAD, SPEED } from '../constants'

export default class Game {
    constructor({ size, aspect_ratio, aliveColor = '#000000', deadColor = '#FFFFFF' }) {
        this.frame_skip = SPEED
        this.size = size
        this.rows = Math.floor(window.innerHeight / size)
        this.cols = Math.floor(this.rows / aspect_ratio)
        this.height = window.innerHeight
        this.width = window.innerHeight / aspect_ratio
        this.canvas = document.createElement('canvas')
        this.ctx = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
        this.canvas.width = this.width
        this.canvas.height = this.height
        this.aliveColor = aliveColor
        this.deadColor = deadColor
        this.grid = []
        this.playing = false
        this.populate()
        this.renderGrid()
    }

    populate() {
        for (let i = 0; i < this.cols; i++) {
            const col = []
            for (let j = 0; j < this.rows; j++) {
                const cellState = Math.random() > 0.5 ? ALIVE : DEAD
                col.push(cellState)
            }
            this.grid.push(col)
        }
    }

    renderGrid(prevGrid) {
        this.grid.forEach((col, i) => {
            col.forEach((state, j) => {
                const x = i * this.size
                const y = j * this.size
                if (!prevGrid || this.grid[i][j] !== prevGrid[i][j]) {
                    this.ctx.fillStyle = state === ALIVE ? this.aliveColor : this.deadColor
                    this.ctx.fillRect(x, y, this.size-1, this.size-1)
                    // this.ctx.arc(x + this.size/2, y + this.size /2, Math.floor(this.size/2 - 1), 0, Math.PI * 2, false)
                    // this.ctx.fill()
                }
            })
        })
    }

    getLiveNeigbhorsCount(x, y) {
        let sum = 0
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const col = (x + i + this.cols)%(this.cols)
                const row = (y + j + this.rows)%(this.rows)
                // const isOutOfBound = col < 0 || col >= this.cols || row < 0 || row >= this.rows
                const isSelf = i === 0 && j === 0
                const isLiveNeigbhor = !isSelf && this.grid[col][row] === ALIVE
                sum += isLiveNeigbhor ? 1 : 0
            }
        }
        return sum
    }

    getNextGridState() {
        let newGrid = this.grid.map((col, i) =>
            col.map((state, j) => {
                const liveNeighbors = this.getLiveNeigbhorsCount(i, j)
                if (liveNeighbors === 3) {
                    return ALIVE
                } else if (liveNeighbors < 2 || liveNeighbors > 3) {
                    return DEAD
                } else {
                    return state
                }
            })
        )
        return newGrid
    }

    gameLoop() {
        requestAnimationFrame(() => {
            this.frame_skip--;
            if (this.frame_skip == 0){
                this.frame_skip = SPEED
            const prevGrid = this.grid
            this.grid = this.getNextGridState()
            this.renderGrid(prevGrid)
            }
            this.gameLoop()
        })
    
    }

    play() {
        // this.playing = true
        if (!this.playing)
            {   
                this.playing = true;
                this.gameLoop()
            }
    }

    pause() {
        this.playing = false
    }
}
