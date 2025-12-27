export const checkWin = (gridCells) => {
    // gridCells is an array of 9 objects { text, isChecked }
    // Indices:
    // 0 1 2
    // 3 4 5
    // 6 7 8

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let score = 0;

    // 1. Calculate points from checked cells (weighted by priority)
    gridCells.forEach(cell => {
        if (cell.isChecked) {
            // Default to 0 if priority is missing for old grids
            score += parseInt(cell.priority || 0, 10);
        }
    });

    // 2. Add bonus points for completed lines (1 point per line)
    for (const combination of winningCombinations) {
        if (combination.every(index => gridCells[index]?.isChecked)) {
            score += 1; // Bonus for completing a line
        }
    }

    return score;
};
