import Head from 'next/head'
import Layout from '../components/layout'
import utilStyles from '../styles/utils.module.css'
import styles from './game.module.css';
import { useState,useEffect } from 'react';
import MyMaze from '../components/GameComponent/mymaze.js'
import PlayerSelect from '../components/GameComponent/playerselect.js';
import MovePlayerButton from '../components/GameComponent/button-move.js';
import EnterPlayerButton from '../components/GameComponent/button-enter.js'
import RobPlayerButton from '../components/GameComponent/button-rob.js'
import PopupMessage from '../components/GameComponent/popup.js';
import webconfig from '../components/config/config.js';
import Rankings from '../components/GameComponent/ranking.js';
import Logs from '../components/GameComponent/logs.js';
import LockInPage from '../components/GameComponent/action-lockin.js';
import ForfeitPage from '../components/GameComponent/action-forfeit.js';
import Laws from '../components/GameComponent/action-law.js';
import EquipEyes from '../components/GameComponent/equip-eyes.js';
import EquipKeys from '../components/GameComponent/equip-keys.js';
import EquipShield from '../components/GameComponent/equip-shield.js';
const CountdownShield = ({ shieldExpireTime, protectionExpireTime, vulnerableTime,mylevel,theirlevel }) => {
    const [status, setStatus] = useState("");

    const computeShield = () => {
        const currentTime = Date.now() / 1000; // Current time in seconds
        var warningtext="";
        if(mylevel<theirlevel){
          warningtext=" (The player has higher level)"
        }
        if (currentTime < vulnerableTime) {
            // Check if shield will be in effect after vulnerable time expires
            if (Math.max(shieldExpireTime, protectionExpireTime) > vulnerableTime) {
                const timeUntilVulnerableExpires = vulnerableTime - currentTime;
                const minutes = Math.floor(timeUntilVulnerableExpires / 60);
                const seconds = Math.ceil(timeUntilVulnerableExpires % 60);
                return `Not Shielded (vulnerable time expires in ${minutes} min ${seconds} sec)`;
            }
        }

        if (currentTime < shieldExpireTime || currentTime < protectionExpireTime) {
            // Player is shielded
            const shieldEndTime = Math.max(shieldExpireTime, protectionExpireTime);
            const timeLeft = shieldEndTime - currentTime;

            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = Math.ceil(timeLeft % 60);

            if (protectionExpireTime > shieldExpireTime) {
                return `Protected (for the next ${hours} hr ${minutes} min ${seconds} sec)`;
            } else {
                return `Shielded (for the next ${hours} hr ${minutes} min ${seconds} sec)`;
            }
        }

        // Player is not shielded
        return "Not Shielded" + warningtext;
    };

    useEffect(() => {
        // Update the status every second
        const interval = setInterval(() => {
            setStatus(computeShield());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [shieldExpireTime, protectionExpireTime, vulnerableTime]);

    return <div>{status}</div>;
};




export default function Game() {


  //INFO TO BE FILLED IN FROM BACKEND;
  const [displayMsg,setDisplayMsg]=useState("Hello")
  const [popupMsg,setPopupMsg]=useState("")
  const [totalMaze,setTotalMaze] = useState(10);
  const [mazeUnlocked,setMazeUnlocked]=useState(Array(totalMaze).fill(false));
  const [mazeUnlockRequirements,setMazeUnlockedRequirements]=useState(Array(totalMaze).fill(""));
  const [unlockedInfo,setunlockedInfo]=useState("There are total of 10 Mazes. They will gradually unlock as mint status and game progresses.");
  // const [playerId,setPlayerId] =useState(1);
  const [loadingMaze,setLoadingMaze]=useState(false);
  const [playerData, setPlayerData] = useState({
    playerid:0,
    playerPosition: { x: 0, y: 0, maze: 0 },
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
    "config": {
    "FIRST_ENTRANCE_MOVE_INTERVAL": 60,
    "MOVE_INTERVAL": 10,
    "PROTECTION_INTERVAL": 43200,
    "MAX_SHIELD_INTERVAL": 86400,
    "MAZE_SWITCH_INTERVAL": 259200,
    "MAZE_SWITCH_PENALTY": "1000000000000000",
    "SHIELD_PRICE": "50000000000000",
    "MIN_LOCK_IN_LV": 3,
    "MIN_SHIELD_LV": 3,
    "EAT_PERCENTAGE": 10,
    "ROB_PERCENTAGE": 10,
    "VULNERABLE_INTERVAL": 600
  },
  "dotsRequired": [
    "0",
    "0",
    "40",
    "200",
    "500"
  ],
  "dailyMoves": [
    "0",
    "10",
    "15",
    "20",
    "25"
  ],
"eliminationModeOn": false
  });
  //TODO set this

  const [contracts, setContracts] = useState({
    GAME: '',
    MAZE: '',
    GAME_EQUIP: '',
    ZSP: '',
    OTOM:'',
    EYE:'',
    KEY:'',
  });
  
  
  
  const [display,setDisplay] = useState('maze')
  const [currmaze, setCurrMaze] = useState(0); // State to store selected maze
  const [mazePositionSelected, setMazePositionSelected] = useState({ x: null, y: null, selected_playerid: null , playerinfo:null});
  const [triggerMazeUpdate, setTriggerMazeUpdate] = useState(() => () => {});
  const [triggerPlayerUpdate, setTriggerPlayerUpdate] = useState(() => () => {});

  const fetchContracts = async () => {
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getContracts`);
      
      const data = await response.json();

      // Update the contracts state with the fetched data
      setContracts({
        GAME: data.GAME,
        MAZE: data.MAZE,
        GAME_EQUIP: data.GAME_EQUIP,
        ZSP: data.ZSP,
        OTOM:data.OTOM,
        EYE:data.EYE,
        KEY:data.KEY,
      });
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };
  const fetchConfig = async () => {
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getConfig`);
      
      const data = await response.json();

      // Update the contracts state with the fetched data
      if(data){
        setconfig(data);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  const fetchMazeUnlocked = async (playerid) => {
    setLoadingMaze(true);
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getMazeUnlock?playerid=${playerid}`);
      
      const data = await response.json();

      // Update the contracts state with the fetched data
      console.log(data.mazeUnlockedStatuses)
      if(data.mazeUnlockedStatuses){
        setMazeUnlocked(data.mazeUnlockedStatuses);
      }
      if(data.mazeUnlockRequirements){
        setMazeUnlockedRequirements(data.mazeUnlockRequirements);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    } finally{
      setLoadingMaze(false);
    }
  
  }

  


  useEffect(() => {
    fetchContracts();
    fetchConfig();
    fetchMazeUnlocked(0);
  }, []);


  const handlePositionSelection = (x, y, selected_playerid,playerinfo) => {
    console.log("position selection",playerinfo)
    setMazePositionSelected({ x, y, selected_playerid,playerinfo});
  };

  const handleMazeSelect = (mazeNumber) => {
    setDisplay('maze');
    setCurrMaze(mazeNumber); // Update state with selected maze number

  };
  const handleOptionSelect =(option) =>{
    setDisplay(option);
  }
  const onSelectPlayer =(playerdata) =>{
    setPlayerData(playerdata);

  }

  const computeMove = (moveInfo) => {
    const currentDay = Math.floor(Date.now() /86400/1000);
    console.log("current day", currentDay)
    const day=moveInfo.day;
    const move=moveInfo.move;
    if(day<currentDay){
      return 0
    }
    else{
      return move;
    }

};

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
                             {mazeUnlocked[mazeNumber] && (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
                               
                               <rect x="5" y="11" width="14" height="10" rx="2" ry="2" ></rect>
                                <path d="M8 11V7a4 4 0 0 1 8 0"></path>
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
            {loadingMaze ? (
                <>Loading Maze Unlock Status...</> // Show loading message
              ) : (
                <>{unlockedInfo}</> // Show fetched maze status
              )}
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
      {display === "maze" && <MyMaze currplayerid={playerData.playerid} playerData={playerData}  eliminationModeOn={config.eliminationModeOn} mazeId={currmaze} onSelect={handlePositionSelection} setTriggerMazeUpdate={setTriggerMazeUpdate} handleOptionSelect={handleOptionSelect} unlocked={mazeUnlocked[currmaze]} unlockRequirement={mazeUnlockRequirements[currmaze]} isspecial={currmaze==totalMaze-1} ></MyMaze>} 
      {display === "log" && <Logs currplayerid={playerData.playerid}></Logs>} {/* Replace with your actual Log component */}
      {display === "ranking" && <Rankings></Rankings>} {/* Replace with your actual Ranking component */}
      {display === "forfeit" && <ForfeitPage contracts={contracts}  playerData={playerData} setPopupMsg={setPopupMsg} ></ForfeitPage>} {/* Replace with your actual Log component */}
      {display === "lockin" && <LockInPage contracts={contracts}  playerData={playerData} setPopupMsg={setPopupMsg} minlevel={config.config.MIN_LOCK_IN_LV}></LockInPage>} {/* Replace with your actual Ranking component */}
      {display === "laws" && <Laws contracts={contracts} eat_percentage={config.config.EAT_PERCENTAGE} currplayerid={playerData.playerid} setPopupMsg={setPopupMsg} ></Laws>} {/* Replace with your actual Ranking component */}
      {display === "shield" && <EquipShield contracts={contracts} currplayerid={playerData.playerid} playerData={playerData}  setPopupMsg={setPopupMsg} ></EquipShield>} {/* Replace with your actual Ranking component */}
      {display === "eyes" && <EquipEyes contracts={contracts} currplayerid={playerData.playerid}  setPopupMsg={setPopupMsg} ></EquipEyes>} {/* Replace with your actual Ranking component */}
      {display === "keys" && <EquipKeys contracts={contracts} currplayerid={playerData.playerid}  setPopupMsg={setPopupMsg} ></EquipKeys>} {/* Replace with your actual Ranking component */}
      </div>

      <div className={`${styles.section} ${styles.section3}`}>
        <div className={styles.menuTop}>
            <PlayerSelect onSelectPlayer={onSelectPlayer} config={config} setTriggerPlayerUpdate={setTriggerPlayerUpdate} handleOptionSelect={handleOptionSelect}></PlayerSelect>
            {/* Content for the top section */}
        </div>
        <div className={styles.menuMiddle}>
            {/* Scrollable text content */}
       
            You selected ({mazePositionSelected.x}, {mazePositionSelected.y})
            <br></br>
        
            {mazePositionSelected.playerinfo && <>
              ------------<br></br>
              Player # {mazePositionSelected.selected_playerid} (ZSP #{mazePositionSelected.playerinfo.tokenId})<br></br>
              Dots: {mazePositionSelected.playerinfo.dots}<br></br>
              Level: {mazePositionSelected.playerinfo.level}<br></br>
              Moves: {computeMove(mazePositionSelected.playerinfo.moveInfo)}<br></br>
              <CountdownShield
                shieldExpireTime={mazePositionSelected.playerinfo.shieldExpireTime}
                protectionExpireTime={mazePositionSelected.playerinfo.protectionExpireTime}
                vulnerableTime={mazePositionSelected.playerinfo.vulnerableTime}
                mylevel={playerData.level}
                theirlevel={mazePositionSelected.playerinfo.level}
              /><br></br>
              -------------
            </>}
            <br></br>
            {contracts.GAME}
            <br></br>
            {displayMsg}
        </div>
        <div className={styles.menuBottom}>
            {/* Fixed-size buttons */}

                
            <button className={styles.actionButton} onClick={() => handleOptionSelect('shield')}>
                SHIELD
                <span className={styles.unlockText}>[Unlock at level {config.config.MIN_SHIELD_LV}]</span>
            </button>
            {/* <button className={styles.actionButton}>
                ROB
                <span className={styles.unlockText}>Surround a victim to rob {config.ROB_PERCENTAGE} % of dots</span>
            </button> */}
             {/* <button className={styles.actionButton}>
                MOVE
                <span className={styles.unlockText}>Move to adjacent squares</span>
            </button> */}
            <RobPlayerButton contracts={contracts} currplayerid={playerData.playerid} victimplayerid={mazePositionSelected.selected_playerid} selected_position={mazePositionSelected} currmaze={currmaze} setDisplayMsg={setDisplayMsg} setPopupMsg={setPopupMsg} onMoveSuccess={() => {triggerMazeUpdate(); triggerPlayerUpdate();}} ></RobPlayerButton>
            <MovePlayerButton contracts={contracts} maze_switch_penalty={config.config.MAZE_SWITCH_PENALTY} currplayerid={playerData.playerid} playerData={playerData} selected_position={mazePositionSelected} currmaze={currmaze} setDisplayMsg={setDisplayMsg} setPopupMsg={setPopupMsg} onMoveSuccess={() => {triggerMazeUpdate(); triggerPlayerUpdate(); } } ></MovePlayerButton>
            <EnterPlayerButton contracts={contracts} currplayerid={playerData.playerid} playerData={playerData} selected_position={mazePositionSelected} currmaze={currmaze} setDisplayMsg={setDisplayMsg} setPopupMsg={setPopupMsg}onMoveSuccess={() => {triggerMazeUpdate(); triggerPlayerUpdate();}} ></EnterPlayerButton>
            <PopupMessage msg={popupMsg} setMsg={setPopupMsg}></PopupMessage>
        </div>
       
        
      </div>
                
    </div>
  

    </Layout>
  )
}
