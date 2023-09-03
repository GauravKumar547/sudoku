import "./Board.css";
import "./buttonContainer.css";
import { useState } from "react";

const globalBoard = [
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  [4, 5, 6, 7, 8, 9, 1, 2, 3],
  [7, 8, 9, 1, 2, 3, 4, 5, 6],
  [2, 3, 1, 5, 6, 4, 8, 9, 7],
  [5, 6, 4, 8, 9, 7, 2, 3, 1],
  [8, 9, 7, 2, 3, 1, 5, 6, 4],
  [3, 1, 2, 6, 4, 5, 9, 7, 8],
  [6, 4, 5, 9, 7, 8, 3, 1, 2],
  [9, 7, 8, 3, 1, 2, 6, 4, 5],
];

var solvedBoard;
function generateInitialBoard() {
  var initialBoard = JSON.parse(JSON.stringify(globalBoard));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
      let r1, r2, temp;
      r1 = j * 3 + Math.floor(Math.random() * 3);
      r2 = j * 3 + Math.floor(Math.random() * 3);
      for (let k = 0; k < 9; k++) {
        temp = initialBoard[k][r1];
        initialBoard[k][r1] = initialBoard[k][r2];
        initialBoard[k][r2] = temp;
      }
    }
  }
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 3; j++) {
      let r1, r2, temp;
      r1 = j * 3 + Math.floor(Math.random() * 3);
      r2 = j * 3 + Math.floor(Math.random() * 3);
      for (let k = 0; k < 9; k++) {
        temp = initialBoard[r1][k];
        initialBoard[r1][k] = initialBoard[r2][k];
        initialBoard[r2][k] = temp;
      }
    }
  }

  solvedBoard = JSON.parse(JSON.stringify(initialBoard));
  let i = 0;
  while (i < 50) {
    let r = Math.floor(Math.random() * 9);
    let c = Math.floor(Math.random() * 9);
    if (initialBoard[r][c] !== " ") {
      initialBoard[r][c] = " ";
      i++;
    }
  }
  return initialBoard;
}

var initialBoard = generateInitialBoard();

export const Board = () => {
  const [board, setBoard] = useState(JSON.parse(JSON.stringify(initialBoard)));

  function resetBoard() {
    setBoard(JSON.parse(JSON.stringify(initialBoard)));
  }

  function newGame() {
    initialBoard = generateInitialBoard();
    resetBoard();
  }
  function isValid(grid, row, col, val, bool) {
    for (let x = 0; x <= 8; x++)
      if (
        (grid[row][x] === val && x !== col && bool) ||
        (grid[row][x] === val && !bool)
      )
        return [false, row + 1, "Row"];

    for (let x = 0; x <= 8; x++)
      if (
        (grid[x][col] === val && x !== row && bool) ||
        (grid[x][col] === val && !bool)
      )
        return [false, col + 1, "Column"];
    let startRow = row - (row % 3),
      startCol = col - (col % 3);

    for (let i = 0; i < 3; i++)
      for (let j = 0; j < 3; j++)
        if (
          (grid[i + startRow][j + startCol] === val &&
            i + startRow !== row &&
            j + startCol !== col &&
            bool) ||
          (grid[i + startRow][j + startCol] === val && !bool)
        ) {
          return [false, startRow + (Math.floor(startCol) / 3 + 1), "Box"];
        }
    return [true, -1, " "];
  }

  function checkBoard() {
    var resVal;
    for (var i = 0; i < 9; i++) {
      for (var j = 0; j < 9; j++) {
        if (board[i][j] !== " ") {
          resVal = isValid(board, i, j, board[i][j], true);
          if (resVal[0] === false) {
            alert("Invalid value at " + resVal[2] + ": " + resVal[1]);
            return;
          }
        }
      }
    }
    alert("The Board is Valid!!");
  }

  function solveBoard() {
    var grid = JSON.parse(JSON.stringify(board));
    var invalid = false;
    if (solverBackPropagate(grid, 0, 0)) {
      var resVal;
      for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
          if (board[i][j] !== " ") {
            resVal = isValid(grid, i, j, grid[i][j], true);
            if (resVal[0] === false) {
              invalid = true;
            }
          }
        }
      }
      if (invalid === false) {
        setBoard(grid);
      } else {
        setBoard(solvedBoard);
      }
    } else {
      setBoard(solvedBoard);
    }
  }
  function solverBackPropagate(grid, row, col) {
    if (row === 8 && col === 9) return true;
    if (col === 9) {
      row++;
      col = 0;
    }
    if (grid[row][col] !== " ") return solverBackPropagate(grid, row, col + 1);
    for (let num = 1; num < 10; num++) {
      if (isValid(grid, row, col, num, false)[0]) {
        grid[row][col] = num;
        if (solverBackPropagate(grid, row, col + 1)) return true;
      }
      grid[row][col] = " ";
    }
    return false;
  }

  function updateTheGrid(e, r, c) {
    var val;
    if (e.target.value === "" || isNaN(parseInt(e.target.value))) {
      val = " ";
    } else {
      val = parseInt(e.target.value) % 10;
    }

    var newBoard = JSON.parse(JSON.stringify(board));
    newBoard[r][c] = val;
    setBoard(newBoard);
  }

  return (
    <div>
      <table className="Sudoku-board">
        <tbody>
          {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((rvalue, rindex) => {
            return (
              <tr key={rindex}>
                {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value, cindex) => {
                  return (
                    <td className="cell" key={rindex * 9 + cindex + 1}>
                      <input
                        className={
                          (rindex + 1) % 3 === 0 &&
                          (cindex + 1) % 3 === 0 &&
                          rindex !== 8 &&
                          cindex !== 8
                            ? "rowSpace colSpace"
                            : (rindex + 1) % 3 === 0 && rindex !== 8
                            ? "rowSpace"
                            : (cindex + 1) % 3 === 0 && cindex !== 8
                            ? "colSpace"
                            : ""
                        }
                        value={board[rindex][cindex]}
                        disabled={initialBoard[rindex][cindex] !== " "}
                        onChange={(event) =>
                          updateTheGrid(event, rindex, cindex)
                        }
                      />
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="buttonContainer">
        <button className="Check" onClick={checkBoard}>
          Check
        </button>
        <button className="Solve" onClick={solveBoard}>
          Solve
        </button>
        <button className="Reset" onClick={resetBoard}>
          Reset
        </button>
        <button className="NewGame" onClick={newGame}>
          New
        </button>
      </div>
    </div>
  );
};
