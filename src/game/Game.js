import { ALIVE, DEAD } from '../constants'

export default class Game {
    constructor({ size, rows, cols, aliveColor = '#000000', deadColor = '#FFFFFF' }) {
        this.size = size
        this.rows = rows
        this.cols = cols
        this.height = rows * size
        this.width = cols * size
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
                    this.ctx.fillRect(x, y, this.size, this.size)
                }
            })
        })
    }

    getLiveNeigbhorsCount(x, y) {
        let sum = 0
        for (let i = -1; i < 2; i++) {
            for (let j = -1; j < 2; j++) {
                const col = x + i
                const row = y + j
                const isOutOfBound = col < 0 || col >= this.cols || row < 0 || row >= this.rows
                const isSelf = i == 0 && j === 0
                const isLiveNeigbhor = !isOutOfBound && !isSelf && this.grid[col][row] === ALIVE
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
            const prevGrid = this.grid
            this.grid = this.getNextGridState()
            this.renderGrid(prevGrid)
            if (this.playing) {
                this.gameLoop()
            }
        })
    }

    play() {
        this.playing = true
        this.gameLoop()
    }

    pause() {
        this.playing = false
    }
}
