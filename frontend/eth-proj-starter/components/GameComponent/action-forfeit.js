import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './action.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const ForfeitPage = ({contracts, playerData,setPopupMsg}) => {
    const [forfeitTo, setForfeitTo] = useState();
  // Prepare the contract write
  const {
    config: config_move,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'forfeit', // Function name
    args: [playerData.playerid,forfeitTo], // Arguments for the function

  });

  const handleForfeitChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) { // Allow only integers or empty input
        setForfeitTo(value === '' ? '' : parseInt(value, 10));
    }
};


  // enterGame(address nftContract, uint256 tokenId,uint8 maze, uint8 x, uint8 y)

  // Contract write hook
  const { data, write } = useContractWrite(config_move);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  


  useEffect(() => {
    if (isLoading) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess){
      setPopupMsg(`Forfeit Success!`);
    }
}, [isLoading,isSuccess,isPrepareError]); 



  return (
    <div className={styles.container}>
        
 
        {playerData.playerid === 0 ? (
            <div className={styles.infoText}>Please select a player on the upper right</div>
            ) : (
                <>
                   {playerData.status =="Active" ? (
                <>
                    <div className={styles.infoText}>
                     <span className={styles.red}> Player #{playerData.playerid} </span>  will forfeit all dots <span className={styles.red}> ({playerData.dots}) </span> to <span className={styles.red}>  Player #{forfeitTo} </span>
                    </div>
                    <div className={styles.inputWrapper}>
                        <input
                        id="forfeitAmount"
                        type="text"
                        value={forfeitTo}
                        onChange={handleForfeitChange}
                        className={styles.inputField}
                        placeholder="Enter Receiver Player Id"
                        />
                    </div>
                    <button
                    className={styles.actionButton}
                    disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()}
                    >
                    {isLoading ? 'Forfeiting' : `Forfeit Player #${playerData.playerid}`}
                    </button>
                    <div className={styles.warningText}>
                        I UNDERSTAND THIS DECISION IS IRREVERSIBLE. <br />
                        I will NOT be able to play with this NFT after forfeit. <br />
                        I will lose ALL my dots and my level will reset to Lv 1. <br />
                    </div>
                </>
                 ) : (
                    <div className={styles.warningText}>
                        This is not an active player.
                    </div>
                    )}
                </>


            )}


    </div>
  );
};

export default ForfeitPage;
