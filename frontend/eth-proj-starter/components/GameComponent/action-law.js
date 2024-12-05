import React, { useState,useEffect } from "react";
import styles from "./action-laws.module.css";
import gameEquipABI from '../abi/game-equip-abi.js';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import webconfig from '../config/config.js';
const Laws = ({contracts,currplayerid,setPopupMsg}) => {
  const [currentRate, setCurrentRate] = useState(10);

  const [votePlayerId, setVotePlayerId] = useState(null);
  const [governer,setGoverner]=useState(0);
  const [topVotedPlayer,setTopVotedPlayer]=useState(0);
  const [topVotedCount,setTopVotedCount]=useState(0);
  const [playerVotedCount,setPlayerVotedCount]=useState(0);
  const [playerVoted,setPlayerVoted]=useState(false);
  const isGovernor=currplayerid!=0 && currplayerid==governer;
  const handleRateChange = (e) => setCurrentRate(e.target.value);
  const handleVoteChange = (e) => setVotePlayerId(e.target.value);

  const {
    config: config_vote,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.GAME_EQUIP, // Address for your GAME contract
    abi: gameEquipABI, // ABI of the contract
    functionName: 'voteForGoverner', // Function name
    args: [votePlayerId,currplayerid], // Arguments for the function

  });

  // Contract write hook
  const { data, write } = useContractWrite(config_vote);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  useEffect(() => {
    const fetchVoteInfo = async () => {
      try {
        const response = await fetch(
          `${webconfig.apiBaseUrl}/getTopVoted?playerid=${currplayerid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch information");
        }
        const data = await response.json();
        setGoverner(data.governer);
        setTopVotedPlayer(data.topVotedPlayer);
        setTopVotedCount(data.topVotedCount);
        setPlayerVoted(data.playerVoted);
        setPlayerVotedCount(data.playerVotedCount)
      } catch (err) {
        console.error("Error fetching dot information:", err.message);
      }
    };

    fetchVoteInfo();
  }, [currplayerid]);

  useEffect(() => {
    if (isLoading) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess){
      setPopupMsg(`Vote Success!`);
    }
}, [isLoading,isSuccess,isPrepareError]); 


  return (
    <div className={styles.container}>
      {/* Top Section */}
      <div className={styles.topSection}>
        <div><b>Only the governor can change the law</b></div>
        <div>Governer for the day is  <span className={styles.highlight}>{(governer==0)? "NOT SET" : `PLAYER ${governer}`}</span> </div>
        <div>You <span className={styles.highlight}>{(isGovernor)? "ARE" : "ARE NOT"} </span> the governor.</div>
      </div>

      {/* Bottom Section */}
      <div className={styles.bottomSection}>
        {/* Left Section: Laws */}
        <div className={`${styles.section} ${styles.section_left}`}>
          <div className={styles.sectionTitle}>
            Laws
            <div className={styles.titleinfo}> Governer may adjust the game parameter </div>
          </div>
          <div className={styles.sectionContent}>
            <p className={styles.lawText}>
              When a Pac is eaten by another Pac, it will lose  <input 
                  type="number" 
                  value={currentRate} 
                  onChange={handleRateChange} 
                  className={`${styles.inputField} ${styles.shortinput}`} 
                  disabled={!isGovernor}
                /> % of dots.

            </p>

  
              <button className={styles.actionButton}>Change</button>
              <div className={styles.infotext}>Governer can make changes once per day</div>
            </div>
        </div>

        {/* Right Section: Election */}
        <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Election
          <div className={styles.titleinfo}>Elect tommorow's governer </div>
        </div>
        <div className={styles.sectionContent}>
          <div>New Governer will be elected everyday on UTC 0:00 </div>

            <input 
              type="number" 
              placeholder="Enter Player ID" 
              value={votePlayerId} 
              onChange={handleVoteChange} 
              className={styles.inputField} 
            />
            <button className={styles.actionButton}      disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()} >Vote</button>

            {playerVoted && <div className={styles.infotext} >You Voted Today</div>}

                     {/* {isSuccess && <p>Player moved successfully!</p>}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>} */}

          <p className={styles.infotext}>
            When two candiadates receives the same amount of votes, the candidate that reaches that vote count earlist will win.
          </p>
          <div className={styles.leadingCandidate}>
            <div><b>Leading Candidate</b></div>
            {topVotedPlayer==0 ? (<p>No one voted yet today</p>) : (<p>Player ID: {topVotedPlayer} ({topVotedCount} Votes)</p>)}
            <p className={styles.infotext}>You received {playerVotedCount} Votes</p>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Laws;
