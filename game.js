// game.js
const CELL_SIZE = 64; 

let playerPos = { x: 0, y: 0 };
let currentLevelData = { cols: 0, rows: 0, blocks: [], traps: [], goal: {x:0, y:0}, start: {x:0, y:0}, walls: [] };

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

    // 1. Renderizar Fondo del Tablero
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.className = 'board-tile';
            tile.style.left = (c * CELL_SIZE) + 'px';
            tile.style.top = (r * CELL_SIZE) + 'px';
            tile.style.width = CELL_SIZE + 'px';
            tile.style.height = CELL_SIZE + 'px';
            screen.appendChild(tile);
        }
    }

    // 2. Procesar Objetos y Paredes Combinadas
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const cellValue = lvl.map[r][c] || ".";
            const items = cellValue.split(',').map(s => s.trim());

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

    // 3. Crear Jugador
    playerPos = { ...currentLevelData.start };
    const player = document.createElement('div');
    player.id = 'player';
    player.style.width = CELL_SIZE + 'px';
    player.style.height = CELL_SIZE + 'px';
    screen.appendChild(player);
    updatePlayerUI();
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

    // Validar límites del mapa
    if (nextX < 0 || nextX >= lvl.cols || nextY < 0 || nextY >= lvl.rows) return;
    
    // Validar bloques sólidos
    if (lvl.blocks.some(b => b.x === nextX && b.y === nextY)) return;
    
    // Validar paredes delgadas
    if (isBlockedByWall(playerPos.x, playerPos.y, nextX, nextY)) return;

    playerPos.x = nextX;
    playerPos.y = nextY;
    updatePlayerUI();

    // Comprobar si pisó trampa
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
        // Bloqueos al salir de la celda actual
        if (w.x === currX && w.y === currY && w.type === 'L' && nextX < currX) return true;
        if (w.x === currX && w.y === currY && w.type === 'R' && nextX > currX) return true;
        if (w.x === currX && w.y === currY && w.type === 'U' && nextY < currY) return true;
        if (w.x === currX && w.y === currY && w.type === 'D' && nextY > currY) return true;

        // Bloqueos al intentar entrar en la celda destino
        if (w.x === nextX && w.y === nextY && w.type === 'R' && nextX < currX) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'L' && nextX > currX) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'D' && nextY < currY) return true;
        if (w.x === nextX && w.y === nextY && w.type === 'U' && nextY > currY) return true;

        return false;
    });
}

function updatePlayerUI() {
    const p = document.getElementById('player');
    if (p) {
        p.style.left = (playerPos.x * CELL_SIZE) + 'px';
        p.style.top = (playerPos.y * CELL_SIZE) + 'px';
    }
}

// Teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') move('up');
    if (e.key === 'ArrowDown') move('down');
    if (e.key === 'ArrowLeft') move('left');
    if (e.key === 'ArrowRight') move('right');
});

// Iniciar al cargar
window.onload = () => {
    loadLevel();
};
