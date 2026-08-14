// levels/level1.js
const NIVELES = [
    {
        // Mapa de 5 filas x 5 columnas
        map: [
            ["P", ".", ".", "#", "."],
            [".", "X", ".", ".", "."],
            [".", ".", ".", "X", "."],
            [".", "#", ".", ".", "."],
            [".", ".", ".", ".", "G"]
        ],
        // Paredes delgadas estratégicas
        // L: Izquierda, R: Derecha, U: Arriba, D: Abajo
        walls: [
            { x: 0, y: 0, type: 'D' }, // Pared abajo de la salida (obliga a ir a la derecha al inicio)
            { x: 2, y: 1, type: 'R' }, // Pared a la derecha de (2,1)
            { x: 2, y: 3, type: 'U' }  // Pared arriba de (2,3)
        ]
    }
];
