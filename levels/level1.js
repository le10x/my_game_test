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
            { x: 5, y: 5, type: 'R' }, // Pared vertical a la derecha de (2,0)
            { x: 5, y: 5, type: 'D' }  // Pared horizontal abajo de (0,3)
        ]
    }
];
