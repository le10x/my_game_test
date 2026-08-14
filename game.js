// game.js
const CELL_SIZE = 64; 

let playerPos = { x: 0, y: 0 };
let currentLevelData = { cols: 0, rows: 0, blocks: [], traps: [], goal: {x:0, y:0}, walls: [] };

function loadLevel() {
    const lvl = LEVEL_DATA;
    const screen = document.getElementById('game-screen');
    screen.innerHTML = '';

    const rows = lvl.map.length;
    const cols = lvl.map[0].length;

    screen.style.width = (cols * CELL_SIZE) + 'px';
    screen.style.height = (rows * CELL_SIZE) + 'px';

    currentLevelData = {
        cols: cols,
        rows: rows,
        blocks: [],
        traps: [],
        goal: { x: 0, y: 0 },
        start: { x: 0, y: 0 },
        walls: []
    };

    // 1. Renderizar Fondo con Autotiling
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.className = 'board-tile';
            tile.style.left = (c * CELL_SIZE) + 'px';
            tile.style.top = (r * CELL_SIZE) + 'px';
            tile.style.width = CELL_SIZE + 'px';
            tile.style.height = CELL_SIZE + 'px';

            const tileTexture = getTileTexture(r, c, rows, cols);
            tile.style.backgroundImage = `url('resources/${tileTexture}')`;
            screen.appendChild(tile);
        }
    }

    // 2. Procesar Objetos y Paredes Combinadas (Lógica Flexible por Comas)
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // Separar cada casilla por comas y limpiar espacios
            const items = lvl.map[r][c].split(',').map(s => s.trim());

            items.forEach(item => {
                // Bloque Sólido
                if (item === '#') {
                    currentLevelData.blocks.push({ x: c, y: r });
                    createEntity('solid-block', c, r, screen);
                } 
                // Trampa
                else if (item === 'X') {
                    currentLevelData.traps.push({ x: c, y: r });
                    createEntity('trap-hazard', c, r, screen);
                } 
                // Meta
                else if (item === 'G') {
                    currentLevelData.goal = { x: c, y: r };
                    const goal = createEntity('', c, r, screen);
                    goal.id = 'goal';
                } 
                // Punto de Inicio / Jugador
                else if (item === 'P') {
                    currentLevelData.start = { x: c, y: r };
                }
                // Paredes Delgadas (U, D, L, R)
                else if (['U', 'D', 'L', 'R'].includes(item)) {
                    currentLevelData.walls.push({ x: c, y: r, type: item });
                    const wall = document.createElement('div');
                    wall.className = `wall-thin wall-${item}`;
                    wall.style.left = (c * CELL_SIZE) + 'px';
                    wall.style.top = (r * CELL_SIZE) + 'px';
                    wall.style.width = CELL_SIZE + 'px';
                    wall.style.height = CELL_SIZE + 'px';
                    screen.appendChild(wall);
                }
            });
        }
    }

    // 3. Crear Jugador (al final para que quede por encima)
    playerPos = { ...currentLevelData.start };
    const player = document.createElement('div');
    player.id = 'player';
    player.style.width = CELL_SIZE + 'px';
    player.style.height = CELL_SIZE + 'px';
    screen.appendChild(player);
    updatePlayerUI();
}

function getTileTexture(r, c, rows, cols) {
    const isTop = (r === 0);
    const isBottom = (r === rows - 1);
    const isLeft = (c === 0);
    const isRight = (c === cols - 1);

    if (rows === 1 && cols === 1) return 'FullCenter.png';

    if (rows === 1) {
        if (isLeft) return 'LCap.png';
        if (isRight) return 'RCap.png';
        return 'HTube.png';
    }

    if (cols === 1) {
        if (isTop) return 'UCap.png';
        if (isBottom) return 'DCap.png';
        return 'VTube.png';
    }

    if (isTop && isLeft) return 'ULCorner.png';
    if (isTop && isRight) return 'URCorner.png';
    if (isBottom && isLeft) return 'DLCorner.png';
    if (isBottom && isRight) return 'DRCorner.png';

    if (isTop) return 'UEdge.png';
    if (isBottom) return 'DEdge.png';
    if (isLeft) return 'LEdge.png';
    if (isRight) return 'REdge.png';

    return 'Center.png';
}

function createEntity(className, c, r, container) {
    const el = document.createElement('div');
    if (className) el.className = className;
    el.style.left = (c * CELL_SIZE) + 'px';
    el.style.top = (r * CELL_SIZE) + 'px';
    el.style.width = CELL_SIZE + 'px';
    el.style.height = CELL_SIZE + 'px';
    container.appendChild(el);
    return el;
}

function move(dir) {
    const lvl = currentLevelData;
    let nextX = playerPos.x;
    let nextY = playerPos.y;

    if (dir === 'up') nextY--;
    if (dir === 'down') nextY++;
    if (dir === 'left') nextX--;
    if (dir === 'right') nextX++;

    // Validar límites y bloques
    if (nextX < 0 || nextX >= lvl.cols || nextY < 0 || nextY >= lvl.rows) return;
    if (lvl.blocks.some(b => b.x === nextX && b.y === nextY)) return;
    if (isBlockedByWall(playerPos.x, playerPos.y, nextX, nextY)) return;

    playerPos.x = nextX;
    playerPos.y = nextY;
    updatePlayerUI();

    // Comprobar colisión con trampa
    if (lvl.traps.some(t => t.x === playerPos.x && t.y === playerPos.y)) {
        setTimeout(() => {
            alert("¡Caíste en una trampa!");
            playerPos = { ...lvl.start };
            updatePlayerUI();
        }, 100);
        return;
    }

    // Comprobar si llegó a la meta
    if (playerPos.x === lvl.goal.x && playerPos.y === lvl.goal.y) {
        setTimeout(() => {
            alert("¡Nivel Completado! 🎉");
            loadLevel();
        }, 100);
    }
}

function isBlockedByWall(currX, currY, nextX, nextY) {
    return currentLevelData.walls.some(w => {
        // Bloqueos desde la celda actual
        if (w.x === currX && w.y === currY && w.type === 'L' && nextX < currX) return true;
        if (w.x === currX && w.y === currY && w.type === 'R' && nextX > currX) return true;
        if (w.x === currX && w.y === currY && w.type === 'U' && nextY < currY) return true;
        if (w.x === currX && w.y === currY && w.type === 'D' && nextY > currY) return true;

        // Bloqueos desde la celda destino
        if (w.x === nextX && w.y === nextY && w.type === 'R' && nextX < currX) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'L' && nextX > currX) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'D' && nextY < currY) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'U' && nextY > currY) return true;

        return false;
    });
}

function updatePlayerUI() {
    const p = document.getElementById('player');
    p.style.left = (playerPos.x * CELL_SIZE) + 'px';
    p.style.top = (playerPos.y * CELL_SIZE) + 'px';
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
});

window.onload = () => {
    loadLevel();
};
