import React, { useState } from 'react';
import styles from './playerselect.module.css'; // Import the styles
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


const PlayerSelect = ({ onSelectPlayer,config }) => {
  // Example player data (replace with actual data from your source)
  const [players,setplayers] = useState([
    {
      "tokenId": "0",
      "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
      "name": "ZSP #0",
      "balance": "1",
      "image": "/icons/pacs/fullpac.jpg"
    },
    {
      "tokenId": "1",
      "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
      "name": "ZSP #1",
      "balance": "1",
      "image": ""
    },
    {
      "tokenId": "2",
      "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
      "name": "ZSP #2",
      "balance": "1",
      "image": ""
    },
    {
      "tokenId": "3",
      "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
      "name": "ZSP #3",
      "balance": "1",
      "image": ""
    },
    {
      "tokenId": "4",
      "contract": "0xe70128b41a93F0B7f4255A8293F665023FcbEDEd",
      "name": "ZSP #4",
      "balance": "1",
      "image": ""
    }
  ]);

  const [selectedPlayer, setSelectedPlayer] = useState(0);
  const [playerData, setPlayerData] = useState({
    playerid:1,
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

  // Handle player selection
  const fetchPlayerData = (player) =>{

  }
  const handlePlayerClick = (player) => {
    setSelectedPlayer(player);
    fetchPlayerData(player);
    // onSelectPlayer(player); // Pass selected player data back to parent
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
                <label className={styles.leftLabel}>{playerData.status}</label>
                <label className={styles.rightLabel}> Player #{playerData.playerid}</label>
            </div>
            <div className={styles.playerinfo_bottom}>
               DOTS: {playerData.dots}
               <br></br>
               MOVES: {playerData.moveInfo.move}
               <br></br>
               <div className={styles.fineprint}> [MOVE COUNT RESETS UTC 0:00]</div>
              
            </div>
        
        </div>
    </div>
 

      {/* Bottom Bar: Progress Bar */}

        <div className={styles.bottom}>
                <ProgressBar startval={40} endval={100} myval={80} mylevel={2}></ProgressBar>
        </div>

    </div>
  );
};

export default PlayerSelect;
