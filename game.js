/**
 * game.js
 * Lógica principal del juego.
 * Asegúrate de cargar level1.js ANTES que este archivo en el HTML.
 */

const TILE_SIZE = 128;
let playerPos = { x: 0, y: 0 };
const boardElement = document.getElementById('game-board');

/**
 * Determina qué imagen de fondo corresponde a cada celda.
 */
function getBoardTileImage(c, r, cols, rows) {
    if (cols === 1 && rows === 1) return 'FullCenter.png';
    
    // Nivel 1xN (Vertical)
    if (cols === 1) {
        if (r === 0) return 'UCap.png';
        if (r === rows - 1) return 'DCap.png';
        return 'VTube.png';
    }
    
    // Nivel Nx1 (Horizontal)
    if (rows === 1) {
        if (c === 0) return 'LCap.png';
        if (c === cols - 1) return 'RCap.png';
        return 'HTube.png';
    }

    // Nivel NxN
    if (r === 0 && c === 0) return 'ULCorner.png';
    if (r === 0 && c === cols - 1) return 'URCorner.png';
    if (r === rows - 1 && c === 0) return 'DLCorner.png';
    if (r === rows - 1 && c === cols - 1) return 'DRCorner.png';
    if (r === 0) return 'UEdge.png';
    if (r === rows - 1) return 'DEdge.png';
    if (c === 0) return 'LEdge.png';
    if (c === cols - 1) return 'REdge.png';
    
    return 'Center.png';
}

/**
 * Inicializa el juego y calcula la escala para que quepa en pantalla.
 */
function initGame() {
    if (typeof levelData === 'undefined') {
        console.error("Error: levelData no definido. Asegúrate de incluir level1.js");
        return;
    }

    playerPos = { ...levelData.playerStart };

    const boardWidth = levelData.cols * TILE_SIZE;
    const boardHeight = levelData.rows * TILE_SIZE;
    
    boardElement.style.width = `${boardWidth}px`;
    boardElement.style.height = `${boardHeight}px`;

    // Calcular escala: reservamos espacio para los controles (150px de altura)
    const availableWidth = window.innerWidth * 0.9;
    const availableHeight = (window.innerHeight - 150) * 0.9;
    const scaleX = availableWidth / boardWidth;
    const scaleY = availableHeight / boardHeight;
    const scale = Math.min(scaleX, scaleY, 1.0); 

    boardElement.style.transform = `scale(${scale})`;
    
    renderBoard();
}

/**
 * Renderiza el tablero completo y los objetos encima.
 */
function renderBoard() {
    boardElement.innerHTML = ''; // Limpiar

    // Dibujar fondo del tablero
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

    // Dibujar Objetos
    renderItem(levelData.check.x, levelData.check.y, 'Check.png');
    levelData.solidBlocks.forEach(b => renderItem(b.x, b.y, 'SolidBlock.png'));
    levelData.over.forEach(o => renderItem(o.x, o.y, 'Over.png'));
    levelData.walls.uWalls.forEach(w => renderItem(w.x, w.y, 'UWall.png'));
    levelData.walls.dWalls.forEach(w => renderItem(w.x, w.y, 'DWall.png'));
    levelData.walls.lWalls.forEach(w => renderItem(w.x, w.y, 'LWall.png'));
    levelData.walls.rWalls.forEach(w => renderItem(w.x, w.y, 'RWall.png'));

    // Dibujar Jugador
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

/**
 * Verifica si hay una pared en una coordenada específica.
 */
function hasWall(x, y, type) {
    if (type === 'U') return levelData.walls.uWalls.some(w => w.x === x && w.y === y);
    if (type === 'D') return levelData.walls.dWalls.some(w => w.x === x && w.y === y);
    if (type === 'L') return levelData.walls.lWalls.some(w => w.x === x && w.y === y);
    if (type === 'R') return levelData.walls.rWalls.some(w => w.x === x && w.y === y);
    return false;
}

/**
 * Lógica de movimiento con colisiones.
 */
function move(dx, dy, currentWallType, targetWallType) {
    const targetX = playerPos.x + dx;
    const targetY = playerPos.y + dy;

    // 1. Limites del tablero
    if (targetX < 0 || targetX >= levelData.cols || targetY < 0 || targetY >= levelData.rows) return;
    
    // 2. Colisión con bloques sólidos
    if (levelData.solidBlocks.some(b => b.x === targetX && b.y === targetY)) return;

    // 3. Colisión con Muros
    // Bloqueado si hay muro en casilla actual (hacia la dirección deseada)
    // O si hay muro en la casilla destino (hacia el lado opuesto)
    if (hasWall(playerPos.x, playerPos.y, currentWallType)) return;
    if (hasWall(targetX, targetY, targetWallType)) return;

    // Mover jugador
    playerPos.x = targetX;
    playerPos.y = targetY;

    // 4. Verificar Over (Perder)
    if (levelData.over.some(o => o.x === playerPos.x && o.y === playerPos.y)) {
        playerPos = { ...levelData.playerStart };
    }

    // 5. Verificar Check (Ganar)
    if (playerPos.x === levelData.check.x && playerPos.y === levelData.check.y) {
        setTimeout(() => alert('¡Nivel Completado!'), 50);
    }

    renderBoard();
}

// Event Listeners para botones
document.getElementById('btn-up').addEventListener('click', () => move(0, -1, 'U', 'D'));
document.getElementById('btn-down').addEventListener('click', () => move(0, 1, 'D', 'U'));
document.getElementById('btn-left').addEventListener('click', () => move(-1, 0, 'L', 'R'));
document.getElementById('btn-right').addEventListener('click', () => move(1, 0, 'R', 'L'));

// Inicialización
window.onload = initGame;
window.addEventListener('resize', initGame);
        
