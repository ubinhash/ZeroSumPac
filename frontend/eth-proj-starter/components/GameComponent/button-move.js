import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';
import styles from './button.module.css'; // Import the CSS module
import React, { useState, useEffect } from "react";
const CountdownMove = ({ nextMoveTime ,nextSwitchMazeTime,switchMaze}) => {
  const [status, setStatus] = useState("");

  const computeTime = () => {
      const currentTime = Date.now() / 1000; // Current time in seconds


      if(!switchMaze){
        if (currentTime < nextMoveTime) {
            // Player is shielded
            const timeLeft = nextMoveTime  - currentTime;

            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = Math.ceil(timeLeft % 60);


            return `Cooldown (${hours} hr ${minutes} min ${seconds} sec)`;

        }

        // Player is not shielded
        return "Move to adjacent squares";
    }
    else{
      if (currentTime < nextSwitchMazeTime) {
        // Player is shielded
        const timeLeft = nextSwitchMazeTime  - currentTime;

        const hours = Math.floor(timeLeft / 3600);
        const minutes = Math.floor((timeLeft % 3600) / 60);
        const seconds = Math.ceil(timeLeft % 60);


        return `Pay penalty or wait for (${hours} hr ${minutes} min ${seconds} sec) to switch for free`;

      }
        return "Hop to a different maze";
    }
  };

  useEffect(() => {
      // Update the status every second
      const interval = setInterval(() => {
          setStatus(computeTime());
      }, 1000);

      return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [nextMoveTime,nextSwitchMazeTime,switchMaze]);

  return <span>{status}</span>;
};

const MovePlayerButton = ({ contracts,currplayerid,playerData ,selected_position,currmaze,setDisplayMsg,setPopupMsg,onMoveSuccess,maze_switch_penalty}) => {
  // Dummy arguments for movePlayerTo
  const playerid = currplayerid; // TO BE CHANGED TODO
  const maze = currmaze; // Example Maze ID
  const x = selected_position.x; // Example X Coordinate
  const y = selected_position.y; // Example Y Coordinate
  const [valueToSend,setValueToSend]=useState(0) ; // Adjust based on your contract's payable requirements
  const [moveButtonText,setMoveButtonText]=useState("Move");
  const [switchMaze,setSwitchMaze]=useState(false);

  // Prepare the contract write
  const {
    config: config_move,
    error: prepareError,
    isError: isPrepareError,
    refetch: refetchPrepare,
  } = usePrepareContractWrite({
    address: contracts.GAME, // Address for your GAME contract
    abi: gameABI, // ABI of the contract
    functionName: 'movePlayerTo', // Function name
    args: [playerid, maze, x, y], // Arguments for the function
    value: valueToSend, // Ether to send (if required by the contract)
  });






  // enterGame(address nftContract, uint256 tokenId,uint8 maze, uint8 x, uint8 y)

  // Contract write hook
  const { data, write } = useContractWrite(config_move);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  // const {
  //   config: config_enter,
  //   error: prepareError_Enter,
  //   isError: isPrepareError_Enter,
  // } = usePrepareContractWrite({
  //   address: contracts.GAME, // Address for your GAME contract
  //   abi: gameABI, // ABI of the contract
  //   functionName: 'enterGame', // Function name
  //   args: ["0x252DfB6aE02f7625807B5372699f0fed83B79161","3",maze, x, y], // Arguments for the function

  // });

  // const { data_enter, write_enter } = useContractWrite(config_enter);

  // // Wait for transaction to complete
  // const { isLoading_Enter, isSuccess_Enter } = useWaitForTransaction({
  //   hash: data_enter?.hash,
  // });

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
    setTimeout(() => {
      refetchPrepare?.();
  }, 11000); // 11 second

    
    }
    if(isPrepareError){
      setDisplayMsg(`Please select a valid square`);
    }
    else{
      setDisplayMsg(``);
    }
   

  }, [isLoading,isSuccess,isPrepareError]); 


  useEffect(() => {
    if(  currplayerid!=0 && playerData.playerPosition.maze!=currmaze){
      setValueToSend(maze_switch_penalty);
      setMoveButtonText("Switch Maze");
      setSwitchMaze(true);
    }
    else{
      setValueToSend(0);
      setMoveButtonText("Move");
      setSwitchMaze(false);
    }

  }, [currplayerid,currmaze,playerData.playerPosition.maze,maze_switch_penalty]); 



  return (
    <div className={styles.ButtonContainer}>

      <button  className={styles.actionButton}  disabled={!write || isLoading || isPrepareError} onClick={() => write?.()}>{isLoading ? 'Moving' : `${moveButtonText}`}

      <span className={styles.unlockText}><CountdownMove nextMoveTime={playerData.nextMoveTime} nextSwitchMazeTime={playerData.nextSwitchMazeTime}  switchMaze={switchMaze}></CountdownMove></span>
      {/* {isSuccess && <p>Player moved successfully!</p>}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>} */}
      </button>

 
   
 

    </div>
  );
};

export default MovePlayerButton;
