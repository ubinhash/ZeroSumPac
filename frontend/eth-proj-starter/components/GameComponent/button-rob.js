import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './button.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const RobPlayerButton = ({ contracts,currplayerid,victimplayerid ,selected_position,currmaze,setDisplayMsg,setPopupMsg,onMoveSuccess}) => {

  const playerid = currplayerid; // TO BE CHANGED TODO


  // Prepare the contract write
  const {
    config: config_move,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'rob', // Function name
    args: [currplayerid,victimplayerid], // Arguments for the function

  });




  // enterGame(address nftContract, uint256 tokenId,uint8 maze, uint8 x, uint8 y)

  // Contract write hook
  const { data, write } = useContractWrite(config_move);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });



  // useEffect(() => {
  //   if (isPrepareError) {
  //     setDisplayMsg(`Error: ${prepareError?.message}`);
  //   }
  // }, [isPrepareError, prepareError]); 

  useEffect(() => {
    if (isLoading) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess){
      setPopupMsg(`Move Success!`);
      console.log("Triggering maze update after 1 s...");

      setTimeout(() => {
        onMoveSuccess();
    }, 1500); // 1000 ms = 1 second

    // Second call after 3 seconds
    setTimeout(() => {
        onMoveSuccess();
    }, 3000); // 3000 ms = 3 seconds

    }
    if(isPrepareError){
      setDisplayMsg(`You can't move there`);
    }
    else{
      setDisplayMsg(``);
    }
   

  }, [isLoading,isSuccess,isPrepareError]); 



  return (
    <div className={styles.ButtonContainer}>

      <button  className={styles.actionButton}  disabled={!write || isLoading || isPrepareError} onClick={() => write?.()}>{isLoading ? 'Robbing' : 'ROB'}

      <span className={styles.unlockText}>Surround a victim to rob 10% of dots</span>
      {/* {currplayerid} */}
      {/* {isSuccess && <p>Player moved successfully!</p>}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>} */}
      </button>



    </div>
  );
};

export default RobPlayerButton;
