import React, { useCallback, useState, useRef } from "react";
import { produce } from "immer";

// Define constants for grid size
const numRows = 50;
const numCols = 50;

// Define possible neighbor positions relative to a cell
const operations = [
  [0, 1],
  [0, -1],
  [1, -1],
  [-1, 1],
  [1, 1],
  [-1, -1],
  [1, 0],
  [-1, 0],
];

// Function to generate an empty grid
const generateEmptyGrid = () => {
  const rows = [];
  for (let i = 0; i < numRows; i++) {
    rows.push(Array.from(Array(numCols), () => 0));
  }

  return rows;
};

function App() {
  // State for the grid, initialized with an empty grid
  const [grid, setGrid] = useState(() => {
    return generateEmptyGrid();
  });

  // State to track if the simulation is running
  const [running, setRunning] = useState(false);

  // Ref to access the latest 'running' state in the callback
  const runningRef = useRef(running);
  runningRef.current = running;

  const runSimulation = useCallback(() => {
    // Stop if not running
    if (!runningRef.current) {
      return;
    }

    // Update the grid based on Game of Life rules
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < numRows; i++) {
          for (let j = 0; j < numCols; j++) {
            let neightbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newJ = j + y;
              if (newI >= 0 && newI < numRows && newJ >= 0 && newJ < numCols) {
                neightbors += g[newI][newJ];
              }
            });

            // Apply Game of Life rules
            if (neightbors < 2 || neightbors > 3) {
              gridCopy[i][j] = 0;
            } else if (g[i][j] === 0 && neightbors === 3) {
              gridCopy[i][j] = 1;
            }
          }
        }
      });
    });
    // Schedule the next simulation step
    setTimeout(runSimulation, 100);
  }, []);

  return (
    <>
      {/* Button to start/stop the simulation */}
      <button
        onClick={() => {
          setRunning(!running);
          if (!running) {
            runningRef.current = true;
            runSimulation();
          }
        }}
      >
        {running ? "stop" : "start"}
      </button>
      {/* Button to generate a random grid */}
      <button
        onClick={() => {
          const rows = [];
          for (let i = 0; i < numRows; i++) {
            rows.push(
              Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0))
            );
          }

          setGrid(rows);
        }}
      >
        random
      </button>
      {/* Button to clear the grid */}
      <button
        onClick={() => {
          setGrid(generateEmptyGrid());
        }}
      >
        clear
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${numCols}, 20px)`,
        }}
      >
        {/* Render the grid */}
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i}-${j}`}
              onClick={() => {
                // Toggle cell state on click
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = grid[i][j] ? 0 : 1;
                });
                setGrid(newGrid);
              }}
              style={{
                width: 20,
                height: 20,
                backgroundColor: grid[i][j] ? "pink" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
    </>
  );
}

export default App;
