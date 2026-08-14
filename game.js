// game.js
const CELL_SIZE = 64; // El renderizado en pantalla escala perfecto tus imágenes de 128x128

let currentLevelIndex = 0;
let playerPos = { x: 0, y: 0 };
let currentLevelData = { cols: 0, rows: 0, blocks: [], traps: [], goal: {x:0, y:0}, walls: [] };

function loadLevel(index) {
    const lvl = NIVELES[index];
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

    // 1. Generar Fondo con Autotiling Inteligente
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

    // 2. Procesar Mapa de Entidades
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const char = lvl.map[r][c];

            if (char === '#') {
                currentLevelData.blocks.push({ x: c, y: r });
                createEntity('solid-block', c, r, screen);
            } else if (char === 'X') {
                currentLevelData.traps.push({ x: c, y: r });
                createEntity('trap-hazard', c, r, screen);
            } else if (char === 'G') {
                currentLevelData.goal = { x: c, y: r };
                const goal = createEntity('', c, r, screen);
                goal.id = 'goal';
            } else if (char === 'P') {
                currentLevelData.start = { x: c, y: r };
            }
        }
    }

    // 3. Procesar Paredes delgadas
    if (lvl.walls) {
        lvl.walls.forEach(w => {
            currentLevelData.walls.push(w);
            const wall = document.createElement('div');
            wall.className = `wall-thin wall-${w.type}`;
            wall.style.left = (w.x * CELL_SIZE) + 'px';
            wall.style.top = (w.y * CELL_SIZE) + 'px';
            wall.style.width = CELL_SIZE + 'px';
            wall.style.height = CELL_SIZE + 'px';
            screen.appendChild(wall);
        });
    }

    // 4. Crear Jugador
    playerPos = { ...currentLevelData.start };
    const player = document.createElement('div');
    player.id = 'player';
    player.style.width = CELL_SIZE + 'px';
    player.style.height = CELL_SIZE + 'px';
    screen.appendChild(player);
    updatePlayerUI();
}

// Algoritmo para determinar cuál textura de tablero usar según sus vecinos
function getTileTexture(r, c, rows, cols) {
    const isTop = (r === 0);
    const isBottom = (r === rows - 1);
    const isLeft = (c === 0);
    const isRight = (c === cols - 1);

    // Caso 1x1
    if (rows === 1 && cols === 1) return 'FullCenter.png';

    // Casos 1xN (Horizontal Tube)
    if (rows === 1) {
        if (isLeft) return 'LCap.png';
        if (isRight) return 'RCap.png';
        return 'HTube.png';
    }

    // Casos Nx1 (Vertical Tube)
    if (cols === 1) {
        if (isTop) return 'UCap.png';
        if (isBottom) return 'DCap.png';
        return 'VTube.png';
    }

    // Esquinas
    if (isTop && isLeft) return 'ULCorner.png';
    if (isTop && isRight) return 'URCorner.png';
    if (isBottom && isLeft) return 'DLCorner.png';
    if (isBottom && isRight) return 'DRCorner.png';

    // Bordes
    if (isTop) return 'UEdge.png';
    if (isBottom) return 'DEdge.png';
    if (isLeft) return 'LEdge.png';
    if (isRight) return 'REdge.png';

    // Centro
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

    // 1. Bordes
    if (nextX < 0 || nextX >= lvl.cols || nextY < 0 || nextY >= lvl.rows) return;
    // 2. Bloques sólidos
    if (lvl.blocks.some(b => b.x === nextX && b.y === nextY)) return;

    // 3. Paredes delgadas
    if (isBlockedByWall(playerPos.x, playerPos.y, nextX, nextY)) return;

    // Mover
    playerPos.x = nextX;
    playerPos.y = nextY;
    updatePlayerUI();

    // Trampa
    if (lvl.traps.some(t => t.x === playerPos.x && t.y === playerPos.y)) {
        setTimeout(() => {
            alert("¡Caíste en una trampa!");
            playerPos = { ...lvl.start };
            updatePlayerUI();
        }, 100);
        return;
    }

    // Victoria
    if (playerPos.x === lvl.goal.x && playerPos.y === lvl.goal.y) {
        setTimeout(() => {
            alert("¡Nivel Completado! 🎉");
            loadLevel(currentLevelIndex);
        }, 100);
    }
}

function isBlockedByWall(currX, currY, nextX, nextY) {
    return currentLevelData.walls.some(w => {
        // Pared a la izquierda en la casilla actual bloquea ir a la izquierda
        if (w.x === currX && w.y === currY && w.type === 'L' && nextX < currX) return true;
        // Pared a la derecha en la casilla actual bloquea ir a la derecha
        if (w.x === currX && w.y === currY && w.type === 'R' && nextX > currX) return true;
        // Pared arriba en la casilla actual bloquea ir arriba
        if (w.x === currX && w.y === currY && w.type === 'U' && nextY < currY) return true;
        // Pared abajo en la casilla actual bloquea ir abajo
        if (w.x === currX && w.y === currY && w.type === 'D' && nextY > currY) return true;

        // Validaciones inversas (si la casilla destino tiene una pared opuesta)
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
    loadLevel(currentLevelIndex);
};
                                          
