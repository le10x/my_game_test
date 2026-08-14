const CELL_SIZE = 64; 

let playerPos = { x: 0, y: 0 };
let currentLevelData = null;

function loadLevel() {
    const lvl = LEVEL_DATA;
    currentLevelData = lvl;
    const screen = document.getElementById('game-screen');
    screen.innerHTML = '';

    const rows = lvl.map.length;
    const cols = lvl.map[0].length;

    screen.style.width = (cols * CELL_SIZE) + 'px';
    screen.style.height = (rows * CELL_SIZE) + 'px';

    // 1. Dibuja las casillas de fondo usando TUS imágenas PNG de la carpeta resources
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            const tile = document.createElement('div');
            tile.style.position = 'absolute';
            tile.style.left = (c * CELL_SIZE) + 'px';
            tile.style.top = (r * CELL_SIZE) + 'px';
            tile.style.width = CELL_SIZE + 'px';
            tile.style.height = CELL_SIZE + 'px';
            tile.style.backgroundSize = 'cover';

            const tileTexture = getTileTexture(r, c, rows, cols);
            tile.style.backgroundImage = `url('resources/${tileTexture}')`;
            screen.appendChild(tile);
        }
    }

    // 2. Dibuja los objetos (Jugador, Trampas, Bloques) usando TUS imágenes
    lvl.map.forEach((rowStr, r) => {
        const items = rowStr.split(',');
        items.forEach((item, c) => {
            const cleanItem = item.trim();
            
            if (cleanItem === 'P') {
                playerPos = { x: c, y: r };
                createImageEntity('Player.png', c, r, screen, 'player');
            } else if (cleanItem === 'X') {
                createImageEntity('Over.png', c, r, screen);
            } else if (cleanItem === 'G') {
                createImageEntity('Check.png', c, r, screen);
            } else if (cleanItem === '#') {
                createImageEntity('SolidBlock.png', c, r, screen);
            } else if (['U', 'D', 'L', 'R'].includes(cleanItem)) {
                createImageEntity(`${cleanItem}Wall.png`, c, r, screen);
            }
        });
    });
}

function createImageEntity(imageName, c, r, container, id = '') {
    const img = document.createElement('div');
    if (id) img.id = id;
    img.style.position = 'absolute';
    img.style.left = (c * CELL_SIZE) + 'px';
    img.style.top = (r * CELL_SIZE) + 'px';
    img.style.width = CELL_SIZE + 'px';
    img.style.height = CELL_SIZE + 'px';
    img.style.backgroundImage = `url('resources/${imageName}')`;
    img.style.backgroundSize = 'cover';
    img.style.zIndex = id === 'player' ? '10' : '5';
    container.appendChild(img);
}

function getTileTexture(r, c, rows, cols) {
    const isTop = (r === 0);
    const isBottom = (r === rows - 1);
    const isLeft = (c === 0);
    const isRight = (c === cols - 1);

    if (rows === 1 && cols === 1) return 'FullCenter.png';
    if (rows === 1) return isLeft ? 'LCap.png' : (isRight ? 'RCap.png' : 'HTube.png');
    if (cols === 1) return isTop ? 'UCap.png' : (isBottom ? 'DCap.png' : 'VTube.png');

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

window.onload = loadLevel;
