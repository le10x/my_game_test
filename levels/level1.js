const levelData = {
    cols: 4,
    rows: 4,
    playerStart: { x: 0, y: 0 },
    check: { x: 4, y: 4 },
    solidBlocks: [
        { x: 0, y: 1 },
        { x: 0, y: 2 }
    ],
    overs: [
        { x: 1, y: 1 },
        { x: 1, y: 2 }
    ],
    walls: [
        { x: 2, y: 0, dir: 'U' },
        { x: 2, y: 0, dir: 'D' },
        { x: 2, y: 0, dir: 'L' },
        { x: 2, y: 0, dir: 'R' }
    ]
};
