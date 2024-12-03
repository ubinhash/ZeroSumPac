import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './action.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const LockInPage = ({contracts, playerData,setPopupMsg,minlevel}) => {

  // Prepare the contract write
  const {
    config: config_move,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'lockIn', // Function name
    args: [playerData.playerid], // Arguments for the function

  });




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
      setPopupMsg(`Lock-in Success!`);
    }
}, [isLoading,isSuccess,isPrepareError]); 



  return (
    <div className={styles.container}>
        
 
        {playerData.playerid === 0 ? (
            <div className={styles.infoText}>Please select a player on the upper right</div>
            ) : (
            <>
                {playerData.level >= minlevel ? (
                <>
                    <div className={styles.infoText}>
                    I WOULD LIKE TO LOCK-IN PAC #{playerData.tokenId} AT LEVEL {playerData.level} with {playerData.dots} Dots. <br />
                    </div>
                    <button
                    className={styles.actionButton}
                    disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()}
                    >
                    {isLoading ? 'Locking In' : `Lock In Player #${playerData.playerid}`}
                    </button>
                    <div className={styles.warningText}>
                    I UNDERSTAND THIS DECISION IS IRREVERSIBLE. <br />
                    I will NOT be able to enter the game with this NFT after lock-in. <br />
                    I will NOT be able to transfer my dots after lock-in. <br />
                    </div>
                </>
                ) : (
                <div className={styles.warningText}>
                    Your player needs to reach Level {minlevel} or higher to lock-in. <br />
                    Keep playing to level up your PAC!
                </div>
                )}
            </>
            )}



    </div>
  );
};

export default LockInPage;
