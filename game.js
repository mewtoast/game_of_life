const LIVE = true
const DEAD = !LIVE
let renderSpeed = 1;

function makeGrid(rows, cols) {
    let grid = new Array(rows)
    for (let i = 0; i < rows; i++) {
        grid[i] = new Array(cols)
    }
    return grid
}

function initializeGrid(grid, n, m) {
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            grid[i][j] = Math.floor(Math.random() * 2) === 1
        }
    }
    console.table(grid)
    return grid
}

function renderGrid(grid, n, m, ctx, rect_size, prev_grid) {
    renderSpeed--;
    if (renderSpeed == 0){
    renderSpeed = 10

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            ctx.beginPath()
            let x = i * rect_size
            let y = j * rect_size

            if (prev_grid === undefined || grid[i][j] != prev_grid[i][j])
            {
                if (grid[i][j] === LIVE) {
                    ctx.fillStyle = 'black'
                } else {
                    ctx.fillStyle = 'white'
                }
                    ctx.fillRect(x, y, rect_size - 1, rect_size - 1)
                }
            }
        }
        prev_grid = grid;
        grid = getNextState(grid, n, m)
    }

    window.requestAnimationFrame(() => renderGrid(grid, n, m, ctx, rect_size, prev_grid))

}

function getLiveNeigbhorsCount(grid, n, m, x, y) {
    let sum = 0
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            if (x + i < 0 || x + i >= n || y + j < 0 || y + j >= m) continue
            if (grid[x + i][y + j] === LIVE) sum += 1
        }
    }
    sum -= grid[x][y]
    return sum
}

function getNextState(grid, n, m) {
    let newState = makeGrid(n, m)
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < m; j++) {
            oldState = grid[i][j]
            let liveNeighbors = getLiveNeigbhorsCount(grid, n, m, i, j)

            if (liveNeighbors === 3) {
                newState[i][j] = LIVE
            } else if (liveNeighbors < 2 || liveNeighbors > 3) {
                newState[i][j] = DEAD
            } else {
                newState[i][j] = oldState
            }
        }
    }

    return newState
}

function draw(grid, n, m) {
    const canvas = document.getElementById('gameCanvas')
    const width = canvas.width
    const ctx = canvas.getContext('2d')
    let rect_size = width / n
    renderGrid(grid, n, m, ctx, rect_size)
}

function main() {
    let n = 20
    let m = 20
    let myGrid = makeGrid(n, m)
    myGrid = initializeGrid(myGrid, n, m)
    draw(myGrid, n, m)
}
