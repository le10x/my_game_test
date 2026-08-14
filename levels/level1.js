// levels/level1.js
if (!window.NIVELES) window.NIVELES = [];

window.NIVELES.push({
    map: [
        ["P", ".", ".", "#", "."],
        [".", "X", ".", ".", "."],
        [".", ".", ".", "X", "."],
        [".", "#", ".", ".", "."],
        [".", ".", ".", ".", "G"]
    ],
    walls: [
        { x: 0, y: 0, type: 'D' },
        { x: 2, y: 1, type: 'R' },
        { x: 2, y: 3, type: 'U' },
        { x: 0, y: 1, type: 'U' }
    ]
});
