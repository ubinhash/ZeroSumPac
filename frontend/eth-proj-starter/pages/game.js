import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './game.module.css';
import { useState } from 'react';
import MyMaze from '../components/GameComponent/mymaze.js'
import PlayerSelect from '../components/GameComponent/playerselect.js';
export default function Game() {

  const mainStyle = {

  };
  //INFO TO BE FILLED IN FROM BACKEND;
  const [totalMaze,setTotalMaze] = useState(10);
  const [mazeUnlocked,setMazeUnlocked]=useState(Array(totalMaze).fill(false));
  const [unlockedInfo,setunlockedInfo]=useState("There are total of 10 Mazes. They will gradually unlock as mint status and game progresses.");
  const [playerId,setPlayerId] =useState(1);
  const [playerData, setPlayerData] = useState({
    playerposition: { x: 0, y: 0, maze: 0 },
    dots: 0,
    level: 0,
    nextMoveTime: 0,
    nextSwitchMazeTime: 0,
    shieldExpireTime: 0,
    protectionExpireTime: 0,
    vulnerableTime: 0,
    nftContract: "",
    tokenId: 0,
    moveInfo: { day: 0, move: 0 },
    status: "Inactive",
  });

 

  const [config,setconfig] = useState({
    FIRST_ENTRANCE_MOVE_INTERVAL: 60,
    MOVE_INTERVAL: 10,
    PROTECTION_INTERVAL: 43200,
    MAX_SHIELD_INTERVAL: 86400,
    MAZE_SWITCH_INTERVAL: 604800,
    MAZE_SWITCH_PENALTY: 0,
    SHIELD_PRICE: 0,
    MIN_LOCK_IN_LV: 3,
    MIN_SHIELD_LV: 3,
    EAT_PERCENTAGE: 10,
    ROB_PERCENTAGE: 10,
    VULNERABLE_INTERVAL: 600,
  });

  const [contracts, setContracts] = useState({
    GAME: '',
    MAZE: '',
    GAME_EQUIP: '',
    ZSP: '',
  });
  
  
  
  const [display,setDisplay] = useState('maze')
  const [currmaze, setCurrMaze] = useState(0); // State to store selected maze
  const [mazePositionSelected, setMazePositionSelected] = useState({ x: null, y: null, selected_playerid: null });

  const handlePositionSelection = (x, y, selected_playerid) => {
    setMazePositionSelected({ x, y, selected_playerid});
  };

  const handleMazeSelect = (mazeNumber) => {
    setDisplay('maze');
    setCurrMaze(mazeNumber); // Update state with selected maze number
    console.log(`Selected Maze: ${mazeNumber}`); // Optional: For debugging
  };
  const handleOptionSelect =(option) =>{
    setDisplay(option);
  }

  return (
    <Layout home>
      <Head>
        <title>Let's Play</title>
      </Head>
    <div className={styles.grid}>
        
    
    <div className={`${styles.section} ${styles.section1}`}>
        <div className={`${styles.menuOptions} ${styles.topMenuOptions}`} >
            <button onClick={() => handleOptionSelect('laws')} >Laws</button>
        </div>
        <div className={styles.mazeSelector}>
            <div  className={styles.mazeButtons}>
                {/* Maze selection buttons */}
                {[...Array(totalMaze-1).keys()].map((mazeNumber) => (
                    <button key={mazeNumber} className={`${ currmaze === mazeNumber && display ==="maze" ? styles.active : ""}`}
                    onClick={() => handleMazeSelect(mazeNumber)}>
                        <span className={styles.mazebuttoncontent}>
                            Maze {mazeNumber}
                            {!mazeUnlocked[mazeNumber] && (
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="black">
                                    <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9zm3 4a2 2 0 110 4 2 2 0 010-4z" />
                                </svg>
                            )}
                        </span>
                    </button>
                ))}
                <button key={totalMaze-1}  className={`${ currmaze === 9 && display ==="maze"  ? styles.active : ""}`}
                onClick={() => handleMazeSelect(9)}>
                     <span className={styles.mazebuttoncontent}>
                     Special 
                     <svg width="24" height="12" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.54545 9C7.45455 9 8.22727 8.70833 8.86364 8.125C9.5 7.54167 9.81818 6.83333 9.81818 6C9.81818 5.16667 9.5 4.45833 8.86364 3.875C8.22727 3.29167 7.45455 3 6.54545 3C5.63636 3 4.86364 3.29167 4.22727 3.875C3.59091 4.45833 3.27273 5.16667 3.27273 6C3.27273 6.83333 3.59091 7.54167 4.22727 8.125C4.86364 8.70833 5.63636 9 6.54545 9ZM6.54545 12C4.72727 12 3.18182 11.4167 1.90909 10.25C0.636364 9.08333 0 7.66667 0 6C0 4.33333 0.636364 2.91667 1.90909 1.75C3.18182 0.583333 4.72727 0 6.54545 0C8.01818 0 9.30473 0.383333 10.4051 1.15C11.5055 1.91667 12.2735 2.86667 12.7091 4H21.8455L24 5.975L20.1818 9.975L17.4545 8L15.2727 10L13.0909 8H12.7091C12.2545 9.2 11.4636 10.1667 10.3364 10.9C9.20909 11.6333 7.94545 12 6.54545 12Z" fill="black"/>
                    </svg>
                     </span>
                    
                </button>
            </div>
            <div className={styles.mazeInfo}>
               {unlockedInfo}
            </div>
            {/* Add as many buttons as needed */}
        </div>
        <div className={styles.menuOptions}>
            {/* Menu option buttons */}
            <button onClick={() => handleOptionSelect('log')} >Log</button>
            <button onClick={() => handleOptionSelect('ranking')} >Ranking</button>
            <button onClick={() => handleOptionSelect('forfeit')}>Forfeit</button>
            <button onClick={() => handleOptionSelect('lockin')}>Lock-in</button>
        </div>
    </div>
      <div className={`${styles.section} ${styles.section2}`}>
      {display === "maze" && <MyMaze currplayerid={playerId} mazeId={currmaze} onSelect={handlePositionSelection}></MyMaze>} 
      {display === "log" && <h1>Log </h1>} {/* Replace with your actual Log component */}
      {display === "ranking" && <h1>Ranking</h1>} {/* Replace with your actual Ranking component */}
      {display === "forfeit" && <h1>Forfeit</h1>} {/* Replace with your actual Log component */}
      {display === "lockin" && <h1>lockin</h1>} {/* Replace with your actual Ranking component */}
      </div>

      <div className={`${styles.section} ${styles.section3}`}>
        <div className={styles.menuTop}>
            <PlayerSelect></PlayerSelect>
            {/* Content for the top section */}
        </div>
        <div className={styles.menuMiddle}>
            {/* Scrollable text content */}
       
            ({mazePositionSelected.x}, {mazePositionSelected.y})
        </div>
        <div className={styles.menuBottom}>
            {/* Fixed-size buttons */}
            <button className={styles.actionButton}>
                SHIELD
                <span className={styles.unlockText}>[Unlock at level {config.MIN_SHIELD_LV}]</span>
            </button>
            <button className={styles.actionButton}>
                ROB
                <span className={styles.unlockText}>Surround a victim to rob {config.ROB_PERCENTAGE} % of dots</span>
            </button>
             <button className={styles.actionButton}>
                MOVE
            </button>
        </div>
        
      </div>
    </div>


    </Layout>
  )
}
