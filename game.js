const TILE_SIZE = 128;
let playerPos = { x: 0, y: 0 };
const boardElement = document.getElementById('game-board');

function getBoardTileImage(col, row, maxCols, maxRows) {
    if (maxCols === 1 && maxRows === 1) return 'FullCenter.png';
    if (maxCols === 1) {
        if (row === 0) return 'UCap.png';
        if (row === maxRows - 1) return 'DCap.png';
        return 'VTube.png';
    }
    if (maxRows === 1) {
        if (col === 0) return 'LCap.png';
        if (col === maxCols - 1) return 'RCap.png';
        return 'HTube.png';
    }
    if (row === 0 && col === 0) return 'ULCorner.png';
    if (row === 0 && col === maxCols - 1) return 'URCorner.png';
    if (row === maxRows - 1 && col === 0) return 'DLCorner.png';
    if (row === maxRows - 1 && col === maxCols - 1) return 'DRCorner.png';
    if (row === 0) return 'UEdge.png';
    if (row === maxRows - 1) return 'DEdge.png';
    if (col === 0) return 'LEdge.png';
    if (col === maxCols - 1) return 'REdge.png';
    return 'Center.png';
}

function initGame() {
    boardElement.style.width = `${levelData.cols * TILE_SIZE}px`;
    boardElement.style.height = `${levelData.rows * TILE_SIZE}px`;
    
    const scale = Math.min(
        (window.innerWidth * 0.9) / (levelData.cols * TILE_SIZE),
        (window.innerHeight * 0.5) / (levelData.rows * TILE_SIZE)
    );
    boardElement.style.transform = `scale(${scale})`;
    boardElement.style.transformOrigin = 'center center';

    playerPos = { ...levelData.playerStart };
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';

    for (let r = 0; r < levelData.rows; r++) {
        for (let c = 0; c < levelData.cols; c++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.style.left = `${c * TILE_SIZE}px`;
            tile.style.top = `${r * TILE_SIZE}px`;
            const tileImg = getBoardTileImage(c, r, levelData.cols, levelData.rows);
            tile.style.backgroundImage = `url('resources/${tileImg}')`;
            boardElement.appendChild(tile);
        }
    }

    renderItem(levelData.check.x, levelData.check.y, 'Check.png');

    levelData.solidBlocks.forEach(b => renderItem(b.x, b.y, 'SolidBlock.png'));
    levelData.over.forEach(o => renderItem(o.x, o.y, 'Over.png'));
    levelData.walls.uWalls.forEach(w => renderItem(w.x, w.y, 'UWall.png'));
    levelData.walls.dWalls.forEach(w => renderItem(w.x, w.y, 'DWall.png'));
    levelData.walls.lWalls.forEach(w => renderItem(w.x, w.y, 'LWall.png'));
    levelData.walls.rWalls.forEach(w => renderItem(w.x, w.y, 'RWall.png'));

    renderItem(playerPos.x, playerPos.y, 'Player.png', 'player-entity');
}

function renderItem(x, y, imgSrc, id = '') {
    const item = document.createElement('div');
    item.className = 'layer-item';
    if (id) item.id = id;
    item.style.left = `${x * TILE_SIZE}px`;
    item.style.top = `${y * TILE_SIZE}px`;
    item.style.backgroundImage = `url('resources/${imgSrc}')`;
    boardElement.appendChild(item);
}

function hasWall(x, y, dir) {
    if (dir === 'U') return levelData.walls.uWalls.some(w => w.x === x && w.y === y);
    if (dir === 'D') return levelData.walls.dWalls.some(w => w.x === x && w.y === y);
    if (dir === 'L') return levelData.walls.lWalls.some(w => w.x === x && w.y === y);
    if (dir === 'R') return levelData.walls.rWalls.some(w => w.x === x && w.y === y);
    return false;
}

function move(dx, dy, dir, oppositeDir) {
    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    if (targetX < 0 || targetX >= levelData.cols || targetY < 0 || targetY >= levelData.rows) return;
    if (hasWall(playerPos.x, playerPos.y, dir)) return;
    if (hasWall(targetX, targetY, oppositeDir)) return;
    if (levelData.solidBlocks.some(b => b.x === targetX && b.y === targetY)) return;

    playerPos.x = targetX;
    playerPos.y = targetY;

    if (levelData.over.some(o => o.x === playerPos.x && o.y === playerPos.y)) {
        playerPos = { ...levelData.playerStart };
    }

    if (playerPos.x === levelData.check.x && playerPos.y === levelData.check.y) {
        setTimeout(() => alert('¡Nivel Completado!'), 50);
    }

    renderBoard();
}

document.getElementById('btn-up').addEventListener('click', () => move(0, -1, 'U', 'D'));
document.getElementById('btn-down').addEventListener('click', () => move(0, 1, 'D', 'U'));
document.getElementById('btn-left').addEventListener('click', () => move(-1, 0, 'L', 'R'));
document.getElementById('btn-right').addEventListener('click', () => move(1, 0, 'R', 'L'));

window.onload = initGame;
window.onresize = initGame;
