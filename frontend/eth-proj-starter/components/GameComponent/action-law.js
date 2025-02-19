import React, { useState,useEffect } from "react";
import styles from "./action-laws.module.css";
import gameEquipABI from '../abi/game-equip-abi.js';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import webconfig from '../config/config.js';
const Laws = ({contracts,eat_percentage,currplayerid,setPopupMsg}) => {
  const [currentRate, setCurrentRate] = useState('loading');

  const [votePlayerId, setVotePlayerId] = useState(null);
  const [governer,setGoverner]=useState(0);
  const [topVotedPlayer,setTopVotedPlayer]=useState(0);
  const [topVotedCount,setTopVotedCount]=useState(0);
  const [playerVotedCount,setPlayerVotedCount]=useState(0);
  const [playerVoted,setPlayerVoted]=useState(false);
  const isGovernor=currplayerid!=0 && currplayerid==governer;
  const [loading, setLoading] = useState(true); 
  const handleRateChange = (e) => {
    const value = e.target.value;
  
    // Allow empty string to clear input
    if (value === "") {
      setCurrentRate("");
      return;
    }
  
    // Convert to a number and validate it's an integer within range
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 0 && parsedValue <= 100) {
      setCurrentRate(parsedValue);
    }
  };
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

  const {
    config: config_change,
    error: prepareError2,
    isError: isPrepareError2,
  } = usePrepareContractWrite({
    address: contracts.GAME_EQUIP, // Address for your GAME contract
    abi: gameEquipABI, // ABI of the contract
    functionName: 'setEat', // Function name
    args: [currentRate,currplayerid], // Arguments for the function

  });

  // Contract write hook
  const { data:data2, write:write2 } = useContractWrite(config_change);

  // Wait for transaction to complete
  const { isLoading:isLoading2, isSuccess:isSuccess2 } = useWaitForTransaction({
    hash: data2?.hash,
  });

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

  const fetchConfig = async () => {
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getConfig`);
      
      const data = await response.json();

      // Update the contracts state with the fetched data
      if(data){
        setCurrentRate(data.config.EAT_PERCENTAGE)
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching contracts:', error);
      setLoading(true);
    }
  };

  useEffect(() => {
    if(eat_percentage==-1){
      setLoading(true);
      fetchConfig();
    }
    else{
      setCurrentRate(eat_percentage);
      setLoading(false);
    }
  }, [eat_percentage]);

  useEffect(() => {


    fetchVoteInfo();
  }, [currplayerid]);

  useEffect(() => {
    if (isLoading) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess){
      setPopupMsg(`Vote Success!`);
      fetchVoteInfo();
    }

    if (isLoading2) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess2){
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

            {loading && ( <p className={styles.infotext} > Loading Percentage..</p> ) }
              <button className={styles.actionButton}  disabled={!write2 || isLoading2 || isPrepareError2}
                    onClick={() => write2?.()}>Change</button>
              <div className={styles.infotext}>Governer can make changes once per day</div>
           
            </div>
        </div>

        {/* Right Section: Election */}
        <div className={styles.section}>
        <div className={styles.sectionTitle}>
          Election
          <div className={styles.titleinfo}>Elect tomorrow's governor </div>
        </div>
        <div className={styles.sectionContent}>
          <div>A new governor will be elected every day at 00:00 UTC </div>

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
            If two candidates receive the same number of votes, the candidate who reaches that vote count first will win
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
