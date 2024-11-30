import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './button.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const MovePlayerButton = ({ contracts ,selected_position,currmaze,setDisplayMsg,setPopupMsg}) => {
  // Dummy arguments for movePlayerTo
  const playerid = 1; // TO BE CHANGED TODO
  const maze = currmaze; // Example Maze ID
  const x = selected_position.x; // Example X Coordinate
  const y = selected_position.y; // Example Y Coordinate
  const valueToSend = 0; // Adjust based on your contract's payable requirements

  // Prepare the contract write
  const {
    config: config_move,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'movePlayerTo', // Function name
    args: [playerid, maze, x, y], // Arguments for the function
    value: valueToSend, // Ether to send (if required by the contract)
  });

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

      <button  className={styles.actionButton}  disabled={!write || isLoading || isPrepareError} onClick={() => write?.()}>{isLoading ? 'Moving' : 'Move'}

      <span className={styles.unlockText}>Move to adjacent squares</span>
      {/* {isSuccess && <p>Player moved successfully!</p>}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>} */}
      </button>

 

    </div>
  );
};

export default MovePlayerButton;
