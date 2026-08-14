// levels/level1.js
const NIVELES = [
    {
        // Matriz del nivel
        map: [
            ["P", "#", "#", "#", "#", "#"],
            [".", "X", ".", ".", "G", "."],
            [".", "#", ".", ".", "#", "."],
            [".", ".", ".", ".", ".", "."],
            [".", "#", "#", ".", "#", "."],
            [".", "X", ".", ".", "#", "#"]
        ],
        // Paredes delgadas por posición exacta de celda
        // tipo: 'L' (Izquierda), 'R' (Derecha), 'U' (Arriba), 'D' (Abajo)
        walls: [
            { x: 0, y: 1, type: 'U' }, // Pared arriba en (0,1)
            { x: 1, y: 1, type: 'U' },
            { x: 1, y: 0, type: 'L' }, // Pared a la izquierda en (1,0)
            { x: 3, y: 3, type: 'R' }  // Pared a la derecha en (3,3)
        ]
    }
];
