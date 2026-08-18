const levelData = {
    cols: 6,
    rows: 6,
    playerStart: { x: 0, y: 0 },
    check: { x: 3, y: 3 },
    solidBlocks: [
        { x: 1, y: 0 },
        { x: 1, y: 1 }
    ],
    overs: [
        { x: 2, y: 0 },
        { x: 3, y: 0 }
    ],
    walls: [
        { x: 2, y: 1, dir: 'U' },
        { x: 2, y: 1, dir: 'D' },
        { x: 2, y: 1, dir: 'L' },
        { x: 2, y: 1, dir: 'R' }
    ]
};
