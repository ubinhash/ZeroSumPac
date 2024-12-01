import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './button.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const EnterPlayerButton = ({ contracts,currplayerid,playerData ,selected_position,currmaze,setDisplayMsg,setPopupMsg,onMoveSuccess}) => {
  // Dummy arguments for movePlayerTo
  const playerid = currplayerid; // TO BE CHANGED TODO
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
    functionName: 'enterGame', // Function name
    args: [playerData.nftContract,playerData.tokenId, maze, x, y], // Arguments for the function
    value: valueToSend, // Ether to send (if required by the contract)
  });




  // enterGame(address nftContract, uint256 tokenId,uint8 maze, uint8 x, uint8 y)

  // Contract write hook
  const { data, write } = useContractWrite(config_move);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const {
    config: config_enter,
    error: prepareError_Enter,
    isError: isPrepareError_Enter,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'enterGame', // Function name
    args: ["0x252DfB6aE02f7625807B5372699f0fed83B79161","3",maze, x, y], // Arguments for the function

  });

  const { data_enter, write_enter } = useContractWrite(config_enter);

  // Wait for transaction to complete
  const { isLoading_Enter, isSuccess_Enter } = useWaitForTransaction({
    hash: data_enter?.hash,
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

      <button  className={styles.actionButton}  disabled={!write || isLoading || isPrepareError} onClick={() => write?.()}>{isLoading ? 'Entering' : 'Enter Game'}

      <span className={styles.unlockText}>Enter NFT Game for the first time</span>
      {/* {playerData.tokenId} */}
      {/* {isSuccess && <p>Player moved successfully!</p>}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>} */}
      </button>



    </div>
  );
};

export default EnterPlayerButton;
