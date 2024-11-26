import React, { useState, useEffect } from "react";
import styles from './maze.module.css'; // Import the CSS module

const MyMaze = ({ mazeId }) => {
  const [zoom, setZoom] = useState(1); // Default zoom level
  const [maze, setMaze] = useState([]); // Initialize maze state
  const [gridSize,setGridSize]=useState(20)
  useEffect(() => {
    // Fetch maze data based on mazeId and set the maze state
    // This should fetch the maze data, but here we are mocking it
    const mazeData = Array(gridSize).fill(Array(gridSize).fill({ id: Math.random(), visited: false }));
    setMaze(mazeData);
  }, [mazeId]);

  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.2, 3)); // Maximum zoom level (example: 3x zoom)
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.2, 1)); // Minimum zoom level (example: 1x zoom)
  };

  return (
    <div className={styles.mazeWrapper}>
      {/* Zoom buttons with fixed position */}
      <div className={styles.zoomButtons}>
        <button className={styles.squarebutton} onClick={zoomIn}>+</button>
        <button className={styles.squarebutton} onClick={zoomOut}>-</button>
      </div>

      <div className={styles.mazeSection}>
        <div 
          className={styles.mazeContainer} 
          style={{ 
            gridTemplateColumns: `repeat(${gridSize}, ${zoom * 25}px)`, // Dynamic zoom
            gridTemplateRows: `repeat(${gridSize}, ${zoom * 25}px)`,
          }}
        >
          {maze.map((row, rowIndex) => (
            row.map((cell, colIndex) => (
              <button
                key={cell.id}
                className={`${styles.mazeCell} ${cell.visited ? styles.mazeCellVisited : ''}`}
                onClick={() => console.log(`Cell clicked: ${rowIndex}-${colIndex}`)}
                onMouseEnter={(e) => e.target.classList.add(styles.mazeCellHover)}
                onMouseLeave={(e) => e.target.classList.remove(styles.mazeCellHover)}
              >
                 <div className={`${styles.centerCircle} ${true ? styles.empty : ''}`}></div>
                {/* {`${rowIndex}-${colIndex}`} */}
              </button>
            ))
          ))}
        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.info1}>Subsection 1</div>
        <div className={styles.info2}>Subsection 2</div>
        <div className={styles.info3}>Subsection 3</div>
      </div>
    </div>
  );
};

export default MyMaze;
