const levelData = {
    cols: 7,
    rows: 7,
    playerStart: { x: 0, y: 1 },
    check: { x: 4, y: 5 },
    solidBlocks: [
        { x: 4, y: 0 },
        { x: 1, y: 4 }
    ],
    over: [
        { x: 1, y: 1 },
        { x: 3, y: 2 }
    ],
    walls: {
        uWalls: [{ x: 0, y: 2 }, { x: 2, y: 4 }],
        dWalls: [],
        lWalls: [],
        rWalls: [{ x: 2, y: 1 }]
    }
};
