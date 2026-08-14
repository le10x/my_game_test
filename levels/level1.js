// levels/level1.js
const NIVELES = [
    {
        // Mapa 5x5 más libre y jugable
        map: [
            ["P", ".", ".", ".", "."],
            [".", "X", ".", "#", "."],
            [".", ".", ".", ".", "."],
            [".", "#", ".", "X", "."],
            [".", ".", ".", ".", "G"]
        ],
        // Solo un par de paredes estratégicas para probar la colisión
        walls: [
            { x: 2, y: 0, type: 'R' }, // Pared vertical a la derecha de (2,0)
            { x: 0, y: 3, type: 'D' }  // Pared horizontal abajo de (0,3)
        ]
    }
];
