import React, { useState,useEffect } from 'react';
import styles from './playerselect.module.css'; // Import the styles
import webconfig from '../config/config.js';
import { useAccount } from 'wagmi';  
const ProgressBar = ({ startval, endval, myval,mylevel }) => {
    // var progressPercentage = ((myval - startval) / (endval - startval)) * 100;
    var progressPercentage =2+ ((myval - startval) / (endval - startval)) * 98;

    return (
        <div className={styles.progressContainer}>
            {/* Progress Bar */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progressFill}
                    style={{
                        width: `${Math.min(Math.max(progressPercentage, 0), 100)}%`,
                    }}
                ></div>
            </div>
            {/* Labels */}
            <div className={styles.progressLabels}>
                <span>{startval} Dots</span>
                <span style={{ textAlign: 'center' }}>Lv {mylevel}</span>
                <span>{endval} Dots</span>
            </div>
        </div>
    );
};
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

const computeMaxMove =(config,level) =>{
  return config.dailyMoves[level];
}


const PlayerSelect = ({ onSelectPlayer,config, setTriggerPlayerUpdate,handleOptionSelect }) => {
  // Example player data (replace with actual data from your source)
  const { address } = useAccount();
  const [players,setplayers] = useState([]);
  // const [players,setplayers] = useState([
  //   {
  //     "tokenId": "0",
  //     "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
  //     "name": "ZSP #0",
  //     "balance": "1",
  //     "image": "/icons/pacs/fullpac.jpg"
  //   },
  // ]);



  const [selectedPlayer, setSelectedPlayer] = useState(null);
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
    status: "Connect Wallet & Select Player",
  });
  const [maxStride,setMaxStride]=useState(0);

  const resetPlayerData =() =>{
    setPlayerData({
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
      status: "Please Connect Wallet",
    })
  }
  useEffect(() => {
    if (address) {
      const network = 'shape-sepolia'; // Or dynamically set the network based on user's selection
      fetchUserNft(address, network);
    } else {
      setplayers([]);
    }
  
    setTriggerPlayerUpdate(() => () => {
      if(selectedPlayer){
        fetchPlayerData(selectedPlayer, 'shape-sepolia');
      }
      
    });
  }, [address, selectedPlayer, setTriggerPlayerUpdate]); // Add `selectedPlayer` to the dependency array
  

  // Handle player selection
  const fetchUserNft = async (owner, network) => {
    try {
      // Assuming webconfig.apiBaseUrl is already set correctly
      const response = await fetch(`${webconfig.apiBaseUrl}/getPacByOwner?owner=${owner}&network=${network}`);
      if (!response.ok) throw new Error('Failed to fetch NFT data');
      const data = await response.json();
      if(data){
        setplayers(data);
      }
    //   if (data && data.length > 0) {
    //     setplayers(data);
    //     setSelectedPlayer(data[0]); // Set the first player as the default selected player
    //     await fetchPlayerData(data[0], network); // Fetch data for the default player
    // } else {
    //     setplayers([]);
    //     resetPlayerData();
    // }
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  
  const fetchPlayerData = async (player,network) =>{
    try {
    const response = await fetch(`${webconfig.apiBaseUrl}/getPlayerId?contract=${player.contract}&tokenid=${player.tokenId}&network=${network}`);
    const data = await response.json();
    const playerid= data.playerId
    const response2 = await fetch(`${webconfig.apiBaseUrl}/getPlayerInfo?playerid=${playerid}&network=${network}`);
    const data2 = await response2.json();

    const response3 = await fetch(`${webconfig.apiBaseUrl}/getMaxStride?playerid=${playerid}&network=${network}`);
    const data3 = await response3.json();
    if (!response.ok) throw new Error('Failed to fetch player data');
    if (!response2.ok) throw new Error('Failed to fetch player data');
    if (!response3.ok) throw new Error('Failed to fetch player data');

    if (playerid == 0) {
      // Set only nftContract and tokenId for playerData
      const updatedPlayerData = {
        playerid:0,
        playerPosition: { x: 0, y: 0, maze: 0 },
        dots: 0,
        level: 0,
        nextMoveTime: 0,
        nextSwitchMazeTime: 0,
        shieldExpireTime: 0,
        protectionExpireTime: 0,
        vulnerableTime: 0,
        moveInfo: { day: 0, move: 0 },
        status: "Inactive",
        nftContract: player.contract,
        tokenId: player.tokenId,
      };
      setPlayerData(updatedPlayerData); // Update state
      onSelectPlayer(updatedPlayerData); 
    } else {
      // Otherwise, set all playerData
      setPlayerData(data2);
      onSelectPlayer(data2);
      setMaxStride(data3.maxStride);
      console.log("playerdata",data2);
    }

    
  } catch (error) {
    console.error('Error fetching contracts:', error);
  }

  }
  const handlePlayerClick = async (player) => {
    if(!player){
        resetPlayerData();
      
    }
    else{
      setSelectedPlayer(player);
      await fetchPlayerData(player,'shape-sepolia');
    }

     // Pass selected player data back to parent
  };

  return (
    <div className={styles.container}>
      <div className={styles.selector}>
        <select
          onChange={(e) => {
            const playerIndex = e.target.value;
            // const player = players.find((p) => p.id === parseInt(playerId));
            handlePlayerClick(players[playerIndex]);
          }}
        >
          <option value="">--Select NFT Player--</option>
          {players.map((player, index) => (
            <option key={index} value={index}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
    <div className={styles.middle}>
        <div className={styles.avatar}>
        <img src={selectedPlayer?.image||"/icons/pacs/mypac.png"} />
        </div>
        <div className={styles.playerinfo}>
            <div className={styles.playerinfo_top}>
                <label className={styles.leftLabel}>{playerData.status}
                   {playerData.status=="Active" && <span> ({playerData.playerPosition.maze},{playerData.playerPosition.x},{playerData.playerPosition.y})</span>} 
                </label>

                {playerData.playerid !=0 && <label className={styles.rightLabel}> Player #{playerData.playerid}</label>}
            </div>
            <div className={styles.playerinfo_bottom}>
               DOTS: {playerData.dots}
               <br></br>
               MOVES: {computeMove(playerData?.moveInfo)} / {computeMaxMove(config,playerData.level)}
               <br></br>
               <div className={styles.fineprint}> [MOVE COUNT RESETS UTC 0:00]</div>
              
            </div>
        
        </div>
    </div>
 

      {/* Bottom Bar: Progress Bar */}

        <div className={styles.bottom}>
          {/* TODO */}
                <ProgressBar startval={config.dotsRequired[playerData.level]}  endval={config.dotsRequired[parseInt(playerData.level)+1]} myval={playerData.dots} mylevel={playerData.level}></ProgressBar>
                <div className={styles.maxstride}> 
                    <div> <img src="/icons/eyes.png" className={styles.icons}/></div> 
                    Max Stride : {maxStride}/2 
                    <button onClick={() => handleOptionSelect('eyes')}>+</button>
              </div>
         </div>

    </div>
  );
};

export default PlayerSelect;
