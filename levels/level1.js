// levels/level1.js
const LEVEL_DATA = {
    // Sintaxis libre combinada por comas:
    // P = Jugador | G = Meta | X = Trampa | # = Bloque | . = Vacío
    // U = Pared Arriba | D = Pared Abajo | L = Pared Izquierda | R = Pared Derecha
    map: [
        ["P,D", ".",     ".",     "#",     "."],
        [".",   "X",     ".",     ".",     "."],
        [".",   ".",     ".",     "X,R",   "."],
        [".",   "#,X",   ".",     "U",     "."],
        [".",   ".",     ".",     ".",     "G"]
    ]
};
