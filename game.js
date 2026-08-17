const TILE_SIZE = 128;
let playerPos = { ...levelData.playerStart };

function getTileTexture(x, y, cols, rows) {
    if (cols === 1 && rows === 1) return 'FullCenter.png';
    if (rows === 1) {
        if (x === 0) return 'LCap.png';
        if (x === cols - 1) return 'RCap.png';
        return 'HTube.png';
    }
    if (cols === 1) {
        if (y === 0) return 'UCap.png';
        if (y === rows - 1) return 'DCap.png';
        return 'VTube.png';
    }
    if (x === 0 && y === 0) return 'ULCorner.png';
    if (x === cols - 1 && y === 0) return 'URCorner.png';
    if (x === 0 && y === rows - 1) return 'DLCorner.png';
    if (x === cols - 1 && y === rows - 1) return 'DRCorner.png';
    if (y === 0) return 'UEdge.png';
    if (y === rows - 1) return 'DEdge.png';
    if (x === 0) return 'LEdge.png';
    if (x === cols - 1) return 'REdge.png';
    return 'Center.png';
}

function initBoard() {
    const board = document.getElementById('board');
    board.style.gridTemplateColumns = `repeat(${levelData.cols}, ${TILE_SIZE}px)`;
    board.style.gridTemplateRows = `repeat(${levelData.rows}, ${TILE_SIZE}px)`;
    board.style.width = `${levelData.cols * TILE_SIZE}px`;
    board.style.height = `${levelData.rows * TILE_SIZE}px`;

    renderBoard();
    scaleBoard();
}

function renderBoard() {
    const board = document.getElementById('board');
    board.innerHTML = '';

    for (let y = 0; y < levelData.rows; y++) {
        for (let x = 0; x < levelData.cols; x++) {
            const cell = document.createElement('div');
            cell.className = 'cell';

            const baseImg = document.createElement('img');
            baseImg.src = `resources/${getTileTexture(x, y, levelData.cols, levelData.rows)}`;
            cell.appendChild(baseImg);

            if (levelData.solidBlocks.some(b => b.x === x && b.y === y)) {
                const img = document.createElement('img');
                img.src = 'resources/SolidBlock.png';
                cell.appendChild(img);
            }

            if (levelData.overs.some(o => o.x === x && o.y === y)) {
                const img = document.createElement('img');
                img.src = 'resources/Over.png';
                cell.appendChild(img);
            }

            if (levelData.check.x === x && levelData.check.y === y) {
                const img = document.createElement('img');
                img.src = 'resources/Check.png';
                cell.appendChild(img);
            }

            levelData.walls.filter(w => w.x === x && w.y === y).forEach(w => {
                const img = document.createElement('img');
                img.src = `resources/${w.dir}Wall.png`;
                cell.appendChild(img);
            });

            if (playerPos.x === x && playerPos.y === y) {
                const img = document.createElement('img');
                img.src = 'resources/Player.png';
                cell.appendChild(img);
            }

            board.appendChild(cell);
        }
    }
}

function scaleBoard() {
    const viewport = document.getElementById('viewport');
    const wrapper = document.getElementById('board-wrapper');
    
    const boardWidth = levelData.cols * TILE_SIZE;
    const boardHeight = levelData.rows * TILE_SIZE;
    
    const availableWidth = viewport.clientWidth * 0.9;
    const availableHeight = viewport.clientHeight * 0.9;
    
    const scale = Math.min(availableWidth / boardWidth, availableHeight / boardHeight);
    wrapper.style.transform = `scale(${scale})`;
}

function hasWall(x, y, dir) {
    return levelData.walls.some(w => w.x === x && w.y === y && w.dir === dir);
}

function movePlayer(dx, dy) {
    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    if (targetX < 0 || targetX >= levelData.cols || targetY < 0 || targetY >= levelData.rows) return;

    if (dx === 0 && dy === -1 && (hasWall(playerPos.x, playerPos.y, 'U') || hasWall(targetX, targetY, 'D'))) return;
    if (dx === 0 && dy === 1 && (hasWall(playerPos.x, playerPos.y, 'D') || hasWall(targetX, targetY, 'U'))) return;
    if (dx === -1 && dy === 0 && (hasWall(playerPos.x, playerPos.y, 'L') || hasWall(targetX, targetY, 'R'))) return;
    if (dx === 1 && dy === 0 && (hasWall(playerPos.x, playerPos.y, 'R') || hasWall(targetX, targetY, 'L'))) return;

    if (levelData.solidBlocks.some(b => b.x === targetX && b.y === targetY)) return;

    playerPos = { x: targetX, y: targetY };

    if (levelData.overs.some(o => o.x === targetX && o.y === targetY)) {
        playerPos = { ...levelData.playerStart };
    }

    renderBoard();

    if (levelData.check.x === targetX && levelData.check.y === targetY) {
        setTimeout(() => alert('¡Nivel Completado!'), 50);
    }
}

document.getElementById('btn-up').addEventListener('click', () => movePlayer(0, -1));
document.getElementById('btn-down').addEventListener('click', () => movePlayer(0, 1));
document.getElementById('btn-left').addEventListener('click', () => movePlayer(-1, 0));
document.getElementById('btn-right').addEventListener('click', () => movePlayer(1, 0));

window.addEventListener('resize', scaleBoard);
window.addEventListener('load', initBoard);
                
