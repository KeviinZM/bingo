export const checkWin = (gridCells) => {
    // gridCells is an array of 9 objects { text, isChecked }
    // Indices:
    // 0 1 2
    // 3 4 5
    // 6 7 8

    if (!Array.isArray(gridCells)) return 0;

    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    let score = 0;

    // 1. Calculate points from checked cells (weighted by priority)
    gridCells.forEach(cell => {
        if (!cell) return;
        // Support both new 'status' and legacy 'isChecked'
        const isSuccess = cell.status === 'success' || (cell.status === undefined && cell.isChecked);

        if (isSuccess) {
            // Priority 1 (Most important) = 9 points
            // Formula: 10 - Priority
            const priority = parseInt(cell.priority || 0, 10);
            if (priority > 0) {
                score += (10 - priority);
            }
        }
    });

    // 2. Add bonus points for completed lines (1 point per line)
    for (const combination of winningCombinations) {
        if (combination.every(index => {
            const c = gridCells[index];
            return c && (c.status === 'success' || (c.status === undefined && c.isChecked));
        })) {
            score += 1; // Bonus for completing a line
        }
    }

    return score;
};

// Wrapper that handles the full grid object (including Bonus cell)
export const calculateTotalScore = (grid) => {
    if (!grid) return 0;

    // Safety check: is it a grid object or just cells?
    const cells = Array.isArray(grid) ? grid : grid.cells;

    let score = checkWin(cells);

    // Add Bonus Logic (Only if it's a grid object with a bonus field)
    if (grid.bonus && grid.bonus.status === 'success') {
        score += 10;
    }

    return score;
};
