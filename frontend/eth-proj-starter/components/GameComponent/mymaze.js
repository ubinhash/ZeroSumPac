import React, { useState, useEffect } from "react";
import styles from './maze.module.css'; // Import the CSS module

const MyMaze = ({ mazeId,currplayerid=0 ,onSelect}) => {
  const [zoom, setZoom] = useState(1); // Default zoom level
  const [maze, setMaze] = useState([]); // Initialize maze state // information to get from backend
  const [gridSize,setGridSize]=useState(20) // information to get from backend
  const [dotInfo, setDotInfo] = useState({
    maze_dot_consumed: 0,
    total_dot_in_maze: 0,
    total_dot_consumed: 0,
    total_dots: 0
  });

  const [hoverX, setHoverX] = useState(null);
  const [hoverY, setHoverY] = useState(null);
  const [selectedRow, setSelectedX] = useState(null);
  const [selectedCol, setSelectedY] = useState(null);


  const setObstacles =(mazeData) => {
    if(mazeId%2==1){
      mazeData[14][5].obstacleImage="5-1.png"
      mazeData[13][6].obstacleImage="5-1.png"
      mazeData[12][7].obstacleImage="5-1.png"
      mazeData[11][8].obstacleImage="6-1.png"
      mazeData[11][9].obstacleImage="2-1.png"
      mazeData[11][10].obstacleImage="2-1.png"
      mazeData[11][11].obstacleImage="6-2.png"
      mazeData[12][12].obstacleImage="5-2.png"
      mazeData[13][13].obstacleImage="5-2.png"
      mazeData[14][14].obstacleImage="5-2.png"
      mazeData[5][5].obstacleImage="5-2.png"
      mazeData[6][6].obstacleImage="5-2.png"
      mazeData[7][7].obstacleImage="5-2.png"
      mazeData[8][8].obstacleImage="6-4.png"
      mazeData[8][9].obstacleImage="2-1.png"
      mazeData[8][10].obstacleImage="2-1.png"
      mazeData[8][11].obstacleImage="6-3.png"
      mazeData[7][12].obstacleImage="5-1.png"
      mazeData[6][13].obstacleImage="5-1.png"
      mazeData[5][14].obstacleImage="5-1.png"
    }
    else if(mazeId%2==0){

      mazeData[5][5].obstacleImage="3-1.png"
      mazeData[5][6].obstacleImage="2-1.png"
      mazeData[5][7].obstacleImage="1-3.png"
      mazeData[6][5].obstacleImage="2-2.png"
      mazeData[7][5].obstacleImage="1-2.png"

      mazeData[14][14].obstacleImage="3-3.png"
      mazeData[14][13].obstacleImage="2-1.png"
      mazeData[14][12].obstacleImage="1-1.png"
      mazeData[13][14].obstacleImage="2-2.png"
      mazeData[12][14].obstacleImage="1-4.png"


      mazeData[5][14].obstacleImage="3-4.png"
      mazeData[5][13].obstacleImage="2-1.png"
      mazeData[5][12].obstacleImage="1-1.png"
      mazeData[6][14].obstacleImage="2-2.png"
      mazeData[7][14].obstacleImage="1-2.png"

      mazeData[14][5].obstacleImage="3-2.png"
      mazeData[13][5].obstacleImage="2-2.png"
      mazeData[12][5].obstacleImage="1-4.png"
      mazeData[14][6].obstacleImage="2-1.png"
      mazeData[14][7].obstacleImage="1-3.png"



    }
  }
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
    mazeData[1][2].hasPlayer=3;
    
    setObstacles(mazeData);
    setMaze(mazeData);
  }, [mazeId]);
  
  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.2, 3)); // Maximum zoom level (example: 3x zoom)
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.2, 1/1.2)); // Minimum zoom level (example: 1x zoom)
  };

  const handleHover = (rowIndex, colIndex) => {
    setHoverX(rowIndex);
    setHoverY(colIndex);
  };
  const handleSelect = (rowIndex, colIndex) => {
    setSelectedX(rowIndex);
    setSelectedY(colIndex);
    onSelect(rowIndex,colIndex,maze[rowIndex][colIndex].hasPlayer);
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
            gridTemplateColumns: `repeat(${gridSize}, ${zoom * 28}px)`, // Dynamic zoom
            gridTemplateRows: `repeat(${gridSize}, ${zoom * 28}px)`,
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
                        cell?.cellInfo === 2 || ( cell.hasPlayer && cell?.hasPlayer !== 0)
                          ? styles.empty
                          : cell?.cellInfo === 0
                          ? styles.filled
                          : cell?.cellInfo === 1
                          ? styles.eaten
                          : ''
                      } ${cell?.playerid !== 0 ? styles.hasplayer : ''}`}
                    ></div>
                    <div className={styles.imageContainer}>
                    {cell.hasPlayer && cell?.hasPlayer !== 0 && (
                      <img
                        src={cell.hasPlayer === currplayerid ? "/icons/pacs/mypac.png" : "/icons/pacs/plainpac.png"}
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

                    {selectedRow==rowIndex &&  selectedCol==colIndex &&  (
                      <img
                        src={"/icons/pacs/selected.png"}
                        alt="Obstacle"
                        className={styles.cellImage}
                      />
                    )}
                    </div>
                  
                  </div>
                );
              })
            ))
          )
        }

        </div>
      </div>
      <div className={styles.infoSection}>
        <div className={styles.info1}>({hoverX},{hoverY})</div>
        <div className={styles.info2}> Maze {mazeId} Dot Eaten : {dotInfo.maze_dot_consumed} /  {dotInfo.total_dot_in_maze} </div>
        <div className={styles.info3}>Total Dot  {dotInfo.total_dot_consumed} /  {dotInfo.total_dots}  </div>
      </div>
    </div>
  );
};

export default MyMaze;
