import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
import gameABI from '../abi/game-abi.js';

const MovePlayerButton = ({ contracts ,selected_position,currmaze}) => {
  // Dummy arguments for movePlayerTo
  const playerid = 1; // Example Player ID
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

  return (
    <div>
      {/* Button to trigger the write function */}
      <button
        onClick={() => write?.()}
        disabled={!write || isLoading}
        style={{
          padding: '10px 20px',
          backgroundColor: isLoading ? 'gray' : 'blue',
          color: 'white',
          cursor: isLoading ? 'not-allowed' : 'pointer',
        }}
      >
        {isLoading ? 'Moving Player...' : 'Move Player'}
      </button>
      <button    disabled={!write || isLoading} onClick={() => write?.()}>{isLoading ? 'Moving' : 'Move'}</button>

      {/* Display success message */}
      {isSuccess && <p>Player moved successfully!</p>}

      {/* Display error if any */}
      {isPrepareError && <p style={{ color: 'red' ,fontSize:"5px"}}>Error: {prepareError?.message}</p>}
    </div>
  );
};

export default MovePlayerButton;
