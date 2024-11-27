import React, { useState, useEffect } from "react";
import styles from './maze.module.css'; // Import the CSS module

const MyMaze = ({ mazeId,currplayerid=0 }) => {
  const [zoom, setZoom] = useState(1); // Default zoom level
  const [maze, setMaze] = useState([]); // Initialize maze state // information to get from backend
  const [gridSize,setGridSize]=useState(20) // information to get from backend
  const [hoverRow, setHoverRow] = useState(null);
  const [hoverCol, setHoverCol] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedCol, setSelectedCol] = useState(null);

  useEffect(() => {
    // Initialize mazeData with gridSize x gridSize, each cell will have id, visited, cellInfo, hasPlayer, and obstacle
    const mazeData = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => ({
        id: Math.random(),             // Unique identifier for the cell
        visited: false,                // Whether the cell has been visited
        cellInfo: 0,                   // cellInfo value (0 = filled, 1 = empty, 2 = obstacle)
        playerid: 0,              //  playerid in the cell, 0=no one
        obstacleImage: null,               //0 - none, 1.pngwhat obstacle are there
      }))

      
    );
    mazeData[1][1].cellInfo=1;
    mazeData[2][2].hasPlayer=1;
    mazeData[3][5].hasPlayer=2;

    mazeData[7][5].hasPlayer=3;
    mazeData[4][15].obstacleImage="5-1.png"
    mazeData[5][14].obstacleImage="5-1.png"
    mazeData[6][13].obstacleImage="5-1.png"
    mazeData[7][12].obstacleImage="6-1.png"
    mazeData[8][12].obstacleImage="2-1.png"
    mazeData[9][12].obstacleImage="2-1.png"
    mazeData[10][12].obstacleImage="6-2.png"
    mazeData[11][13].obstacleImage="5-2.png"
    mazeData[12][14].obstacleImage="5-2.png"
    mazeData[13][15].obstacleImage="5-2.png"

    mazeData[4][4].obstacleImage="5-2.png"
    mazeData[5][5].obstacleImage="5-2.png"
    mazeData[6][6].obstacleImage="5-2.png"
    mazeData[7][7].obstacleImage="6-4.png"
    mazeData[8][7].obstacleImage="2-1.png"
    mazeData[9][7].obstacleImage="2-1.png"
    mazeData[10][7].obstacleImage="6-3.png"
    mazeData[11][6].obstacleImage="5-1.png"
    mazeData[12][5].obstacleImage="5-1.png"
    mazeData[13][4].obstacleImage="5-1.png"

    setMaze(mazeData);
  }, [mazeId]);
  
  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.2, 3)); // Maximum zoom level (example: 3x zoom)
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.2, 1)); // Minimum zoom level (example: 1x zoom)
  };

  const handleHover = (rowIndex, colIndex) => {
    setHoverRow(rowIndex);
    setHoverCol(colIndex);
  };
  const handleSelect = (rowIndex, colIndex) => {
    setSelectedRow(rowIndex);
    setSelectedCol(colIndex);
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
{
          Array.isArray(maze) && maze.length > 0 && maze[0] && (
            [...Array(maze[0].length)].map((_, colIndex) => (
              maze.map((row, rowIndex) => {
                const cell = row[colIndex];
                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`${styles.mazeCell} ${cell?.visited ? styles.mazeCellVisited : ''}`}
                    onClick={() => handleSelect(rowIndex, colIndex)}
                    onMouseEnter={() => handleHover(rowIndex, colIndex)}
                    onMouseLeave={() => handleHover(null, null)}
                  >
                    <div
                      className={`${styles.centerCircle} ${
                        cell?.cellInfo === 2 || cell?.playerid !== 0
                          ? styles.empty
                          : cell?.cellInfo === 0
                          ? styles.filled
                          : cell?.cellInfo === 1
                          ? styles.eaten
                          : ''
                      } ${cell?.playerid !== 0 ? styles.hasplayer : ''}`}
                    ></div>

                    {cell?.playerid !== 0 && (
                      <img
                        src={cell?.playerid === currplayerid ? "/icons/pacs/mypac.png" : "/icons/pacs/pac.png"}
                        alt="Player Icon"
                        className={styles.cellImage}
                      />
                    )}

                    {cell?.obstacleImage && (
                      <img
                        src={`icons/maze/${cell?.obstacleImage}`}
                        alt="Obstacle"
                        className={styles.cellImage}
                      />
                    )}
                  </div>
                );
              })
            ))
          )
        }

        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.info1}>({hoverRow},{hoverCol})</div>
        <div className={styles.info2}>Subsection 2</div>
        <div className={styles.info3}>Subsection 3</div>
      </div>
    </div>
  );
};

export default MyMaze;
