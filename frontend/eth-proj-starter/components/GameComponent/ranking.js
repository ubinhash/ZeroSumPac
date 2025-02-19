import webconfig from '../config/config.js';
import React, { useState, useEffect } from "react";
import styles from "./ranking.module.css";
import EndingComponent from '../DisplayComponent/ending.js';

const Rankings = () => {
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dotInfo, setDotInfo] = useState({
    totalDotsConsumed: "0",
    level3DotsLocked: "0",
    level4DotsLocked: "0",
  });
  
  const [showEnding, setShowEnding] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [playerAddress, setPlayerAddress] = useState("");
  const [playerPositions, setPlayerPositions] = useState({});

  const toggleEnding = () => {
    setShowEnding(!showEnding);
  };
  const togglePlayerDetails = (playerid) => {
    if (selectedPlayer === playerid) {
      setSelectedPlayer(null);
    } else {
      setSelectedPlayer(playerid);
      fetchPlayerAddress(playerid);
      fetchPlayerPosition(playerid);
    }
  };


  const fetchPlayerAddress = async (playerid) => {
    try {
      const response = await fetch(`${webconfig.apiBaseUrl}/playerid_to_address?playerid=${playerid}`, {
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch player address");
      }
      const data = await response.json();
      setPlayerAddress(data.address);
    } catch (err) {
      console.error("Error fetching player address:", err.message);
      setPlayerAddress("Error fetching address");
    }
  };

  const fetchPlayerPosition = async (playerid) => {
    try {
      const response2 = await fetch(`${webconfig.apiBaseUrl}/getPlayerInfo?playerid=${playerid}`);
      if (!response2.ok) {
        throw new Error("Failed to fetch player position");
      }
      const data2 = await response2.json();
      setPlayerPositions(prev => ({ ...prev, [playerid]: data2.playerPosition }));
    } catch (err) {
      console.error("Error fetching player position:", err.message);
      setPlayerPositions(prev => ({ ...prev, [playerid]: "Error fetching position" }));
    }
  };


  // Fetch rankings from the API
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        const response = await fetch(`${webconfig.apiBaseUrl}/rankings`);
        if (!response.ok) {
          throw new Error("Failed to fetch rankings");
        }
        const data = await response.json();
        setRankings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  useEffect(() => {
    const fetchDotInfo = async () => {
      try {
        const response = await fetch(
          `${webconfig.apiBaseUrl}/getDotConsumed?maze=0`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch dot information");
        }
        const data = await response.json();
        setDotInfo({
          totalDotsConsumed: data.totalDotsConsumed,
          level3DotsLocked: data.level3DotsLocked,
          level4DotsLocked: data.level4DotsLocked,
        });
      } catch (err) {
        console.error("Error fetching dot information:", err.message);
      }
    };

    fetchDotInfo();
  }, []);

  if (loading) {
    return <div className={styles.message}>Loading rankings...</div>;
  }

  if (error) {
    return <div className={styles.message}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerItem}>Level 3 Dots Locked: {dotInfo.level3DotsLocked}</div>
        <div className={styles.headerItem}>Level 4 Dots Locked: {dotInfo.level4DotsLocked}</div>
        <div className={styles.headerItem}>Total Dots Consumed: {dotInfo.totalDotsConsumed}</div>
      </div>
      
      <div className={styles.ending_container}>
        <button className={styles.button} onClick={toggleEnding}>
          {showEnding ? 'Hide Info' : 'When does the game end?'}
        </button>
        {showEnding && <EndingComponent />}
      </div>

      <h1 className={styles.title}>Player Rankings</h1>
      {rankings.length > 0 ? (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Rank</th>
              <th>Player ID</th>
              <th>Total Dots</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((player, index) => (
              <React.Fragment key={player.playerid}>
                <tr>
                  <td>{index + 1}</td>
                  <td>{player.playerid}</td>
                  <td>{player.totalDots}</td>
                  <td>
                    <button className={styles.button} onClick={() => {
                        togglePlayerDetails(player.playerid)
                      }}>
                      See Detail
                    </button>
                  </td>
                </tr>
                {selectedPlayer === player.playerid && (
                  <tr>
                    <td colSpan="4" className={styles.detailContainer}>
                      <h2>Player Details</h2>
                      <p>Player ID: {selectedPlayer}</p>
                      {playerAddress && <>Address:<a href={`https://shapescan.xyz/address/${playerAddress}`} target="_blank"> {playerAddress}</a></>}
                      {playerPositions[player.playerid] && (
                        <p>Position: ({playerPositions[player.playerid].x}, {playerPositions[player.playerid].y}) Maze: {playerPositions[player.playerid].maze}</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={styles.message}>No rankings available</p>
      )}
    </div>
  );
};

export default Rankings;
