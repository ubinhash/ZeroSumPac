import React, { useState, useEffect } from "react";
import styles from './maze.module.css'; // Import the CSS module
import styles2 from './action.module.css'; // Import the CSS module
import webconfig from '../config/config.js';

const MyMaze = ({ mazeId,currplayerid=0 ,onSelect,setTriggerMazeUpdate,unlocked,unlockRequirement,isspecial, handleOptionSelect}) => {
  const [zoom, setZoom] = useState(1); // Default zoom level
  const [maze, setMaze] = useState([]); // Initialize maze state // information to get from backend
  const [gridSize,setGridSize]=useState(20) // information to get from backend
  const [eliminationMode,setEliminationMode]=useState(false);
  const [dotInfo, setDotInfo] = useState({
    maze_dot_consumed: 0,
    total_dot_in_maze: 0,
    total_dot_consumed: 0,
    total_dots: 0
  });
  const [playeridToTokenId,setplayeridToTokenId]=useState({})

  const hints = [
    'Elimination Mode will begin when all dots are consumed',
    'Select a position on board, then click "move" to send a transaction',
    'There are multiple possible endings for this game, with different reward',
    'Higher level player may prefer to end the game before elimination mode',
    'Governer may change the game parameter -> [Laws]',
    'Collaborate with others to rob a high level player',
    'Shapecraft keys and eyes have special use case in game',
  ];
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const handleHintClick = () => {
    // Move to the next hint, wrap around to the first hint when at the end
    setCurrentHintIndex((prevIndex) => (prevIndex + 1) % hints.length);
  };

  const [hoverX, setHoverX] = useState(null);
  const [hoverY, setHoverY] = useState(null);
  const [selectedRow, setSelectedX] = useState(null);
  const [selectedCol, setSelectedY] = useState(null);

  const [specialMazeUnlocked,setSpecialMazeUnlocked]=useState(false)

  const setObstacles =(mazeData) => {
    if(mazeId%2==0){
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
    else if(mazeId%2==1){

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

  const setMazeDotData = async (mazeNumber, mazeData) => {
    try {
      const response = await fetch(`${webconfig.apiBaseUrl}/dot_locations?maze_number=${mazeNumber}`);
      const data = await response.json();
  
      const updatedMazeData = mazeData.map((row, xIndex) =>
        row.map((cell, yIndex) => {
          if (xIndex < gridSize && yIndex < gridSize) {
            return {
              ...cell,
              cellInfo: data[xIndex]?.[yIndex] ?? cell.cellInfo, // Use the value from data or retain the original
            };
          }
          return cell;
        })
      );
  
      return updatedMazeData;
    } catch (error) {
      console.error('Error fetching maze data:', error);
      return mazeData; // Return the original mazeData on error
    }
  };
  
  const setMazePlayerData = async (mazeNumber, mazeData) => {
    try {
      const response = await fetch(`${webconfig.apiBaseUrl}/player_locations?maze_number=${mazeNumber}`);
      const data = await response.json();
  
      const updatedMazeData = mazeData.map((row, xIndex) =>
        row.map((cell, yIndex) => {
          if (xIndex < gridSize && yIndex < gridSize) {
            return {
              ...cell,
              hasPlayer: data[xIndex]?.[yIndex] ?? cell.hasPlayer, // Use the value from data or retain the original
            };
          }
          return cell;
        })
      );
  
      return updatedMazeData;
    } catch (error) {
      console.error('Error fetching maze data:', error);
      return mazeData; // Return the original mazeData on error
    }
  };
  
  const fetchAndPopulateMaze = async (mazeId, mazeData) => {
    console.log("Fetching maze data...");
    let updatedMazeData = await setMazeDotData(mazeId, mazeData);
    updatedMazeData = await setMazePlayerData(mazeId, updatedMazeData);
    setMaze(updatedMazeData); // Update state after processing
  };
  
  const fetchDotInfo = async (mazeNumber) => {
    try {
      const response = await fetch(`${webconfig.apiBaseUrl}/getDotConsumed?maze_number=${mazeNumber}`);
      const data = await response.json();
      setDotInfo(prevDotInfo => ({
        ...prevDotInfo,
        maze_dot_consumed: data.mazeDotsConsumed,
        total_dot_consumed: data.totalDotsConsumed,
        total_dots: data.totalDotsInMaze
      }));
  
    } catch (error) {
      console.error('Error fetching maze data:', error);
    }
  };

  const fetchPlayerData = async (playerid,network) =>{
    try {
      if (playerid == 0) {
        return null
      } else {
        const response2 = await fetch(`${webconfig.apiBaseUrl}/getPlayerInfo?playerid=${playerid}&network=${network}`);
        console.log("playerinfo",`${webconfig.apiBaseUrl}/getPlayerInfo?playerid=${playerid}&network=${network}`)
        const data2 = await response2.json();
        return data2;
      }

    } catch (error) {
      console.error('Error fetching contracts:', error);
    }

  }
  const fetchSpecialMazeUnlocked = async (playerid) => {
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getSpecialMazeUnlock?playerid=${playerid}`);
      
      const data = await response.json();

      setSpecialMazeUnlocked(data.mazeUnlocked);
      console.log("specialmaze",data.mazeUnlocked)

    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  }

  const fetchPlayeridToTokenId = async () => {
        try {
            const response = await fetch(`${webconfig.apiBaseUrl}/playerid_to_tokenid`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log(data,"playeridtokenid")
            setplayeridToTokenId(data); // Update state with fetched data
        } catch (error) {
            console.error("Error fetching playeridToTokenId:", error.message);
        }
    };
    useEffect(() => {
      fetchPlayeridToTokenId();
  }, []);


  useEffect(() => {
    if(isspecial){
      fetchSpecialMazeUnlocked(currplayerid);
    }
  }, [currplayerid]);
  

  useEffect(() => {
    // Initialize mazeData with gridSize x gridSize, each cell will have id, visited, cellInfo, hasPlayer, and obstacle
    const mazeData = Array(gridSize).fill(null).map(() => 
      Array(gridSize).fill(null).map(() => ({
        id: Math.random(),             // Unique identifier for the cell
        visited: false,                // Whether the cell has been visited
        cellInfo: 0,                   // cellInfo value (0 = filled, 1 = empty, 2 = obstacle)
        hasPlayer:0,          //  playerid in the cell, 0=no one
        obstacleImage: null,               //0 - none, 1.pngwhat obstacle are there
      }))
    );
    setObstacles(mazeData);
    setMaze(mazeData);
   
    fetchAndPopulateMaze(mazeId,mazeData);
    fetchDotInfo(mazeId)
    setTriggerMazeUpdate(() => () => {
      fetchAndPopulateMaze(mazeId, mazeData);
      fetchDotInfo(mazeId);
  });

    // mazeData[1][1].cellInfo=1;
    // console.log(mazeData[2][6]);
    // mazeData[2][6].hasPlayer=1;
    
    // mazeData[3][5].hasPlayer=2;
    // mazeData[1][2].hasPlayer=3;
    
 
  }, [mazeId,setTriggerMazeUpdate]);
  
  const zoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom * 1.2, 3)); // Maximum zoom level (example: 3x zoom)
  };

  const zoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom / 1.2, 1/1.2)); // Minimum zoom level (example: 1x zoom)
  };
  const refresh =() =>{
    fetchAndPopulateMaze(mazeId, maze);
    fetchDotInfo(mazeId);
  }

  const handleHover = (rowIndex, colIndex) => {
    setHoverX(rowIndex);
    setHoverY(colIndex);
  };
  const handleSelect = async (rowIndex, colIndex) => {
    setSelectedX(rowIndex);
    setSelectedY(colIndex);
    const selectedPlayerData=await fetchPlayerData(maze[rowIndex][colIndex].hasPlayer,'shape-sepolia' );
    onSelect(rowIndex,colIndex,maze[rowIndex][colIndex].hasPlayer,selectedPlayerData);
  };

  return (
    <div className={styles.mazeWrapper}>
      {/* Zoom buttons with fixed position */}
      { ((unlockRequirement && !unlocked) && (!isspecial || (isspecial && !specialMazeUnlocked)))  && 
     
      <div className={styles.centerInfo}>    
       {specialMazeUnlocked}
            {unlockRequirement} 
            <br></br>
           {isspecial && <button className={styles2.actionButton} onClick={() => handleOptionSelect('keys')}>Equip</button>}
      </div>}
      <div className={styles.zoomButtons}>
        <button className={styles.squarebutton} onClick={zoomIn}>+</button>
        <button className={styles.squarebutton} onClick={zoomOut}>-</button>
        <button className={`${styles.squarebutton} ${styles.longbutton}`} onClick={refresh}>Refresh</button>
        <div  className={styles.fineprint} onClick={handleHintClick}  >
          {hints[currentHintIndex]}
        </div>
    
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
                      }`}
                    ></div>
                    <div className={styles.imageContainer}>
                 
                    {( cell?.hasPlayer !== 0) && (
                      <img
                        src={cell.hasPlayer == currplayerid ? "/icons/pacs/mypac.png" : `/icons/pacs/avatar/${playeridToTokenId[cell.hasPlayer]%10 ||"pac"}.jpg`}
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
        <div className={styles.info1}>({hoverX},{hoverY}) {currplayerid}</div>
        <div className={styles.info2}> Maze {mazeId} Dot Eaten : {dotInfo.maze_dot_consumed} /  {dotInfo.total_dot_in_maze} </div>
        <div className={styles.info3}>Total Dot:  {dotInfo.total_dot_consumed} /  {dotInfo.total_dots}  </div>
      </div>
    </div>
  );
};

export default MyMaze;
