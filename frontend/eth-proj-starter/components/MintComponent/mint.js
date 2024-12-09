import React, { useState,useEffect } from 'react';
import styles from './mint.module.css';
import ChainInfo from '../network';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction ,useContractRead} from 'wagmi';
import ZSPABI from '../abi/zsp-abi.js';
import webconfig from '../config/config.js';
const ImageRotator = () => {

    
    const [images, setImages] = useState([
      "images/nft/circle/1.png",
      "images/nft/circle/2.png",
      "images/nft/circle/3.png",
      "images/nft/circle/4.png",
    ]);
    
  
    // Function to rotate images
    const rotateImages = (index) => {
      const rotated = [
        ...images.slice(index),
        ...images.slice(0, index),
      ];
      setImages(rotated);
    };

  
  
    return (
      <div className={styles.left}>

        {/* <p>Current Network: {network ? `${network}` : "None"}</p> */}

        <div className={styles.topImage}>
          <img
            src={images[0]}
            alt="Top Image"
            onClick={() => rotateImages(0)}
          />
        </div>
        <div className={styles.bottomImages}>
          {images.slice(1).map((image, index) => (
            <div
              key={index}
              className={styles.bottomImage}
              onClick={() => rotateImages(index + 1)}
            >
              <img src={image} alt={`Image ${index + 2}`} />
            </div>
          ))}
        </div>
      </div>
    );
  };
  


const MintComponent = ({setPopupMsg}) => {
  // Local state variables
  const [network, setNetwork] = useState(null); 
  const [quantity, setQuantity] = useState(1); // Default starting quantity
  const [price,setPrice]=useState(15000000000000000);
  const [totalprice,setTotalPrice]=useState(price*quantity);
  const maxAmount = 4; // Maximum allowed quantity
  const [currentSupply,setCurrentSuuply] = useState(0); // Current minted supply
  const totalSupply = 666; // Total supply available
  const [contracts, setContracts] = useState({
    GAME: '',
    MAZE: '',
    GAME_EQUIP: '',
    ZSP: '',
    OTOM:'',
  });
  

  const {
    config: config_mint,
    error: prepareError,
    isError: isPrepareError,
  } = usePrepareContractWrite({
    address: contracts.ZSP, // Address for your GAME contract
    abi: ZSPABI, // ABI of the contract
    functionName: 'publicMint', // Function name
    args: [quantity], // Arguments for the function
    value:totalprice.toString(),

  });

  // Contract write hook
  const { data, write } = useContractWrite(config_mint);

  // Wait for transaction to complete
  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  const {data:dataread,refetch} = useContractRead({
    address: contracts.ZSP,
    abi: ZSPABI,
    functionName: 'totalSupply',
    onSettled(data, error) {
        if(data){
          setCurrentSuuply(Number(data))
        }
        if(error){
            console.log("failed")
            console.log(error)
        }

    },
  })

  const weiToEth = (wei) => {
    return wei / 1e18; // Convert Wei to ETH
  };

  const fetchContracts = async () => {
    try {
      // const response = await fetch(`http://localhost:3002/getContracts`);
      const response = await fetch(`${webconfig.apiBaseUrl}/getContracts?network=${network}`);
      
      const data = await response.json();

      // Update the contracts state with the fetched data
      setContracts({
        GAME: data.GAME,
        MAZE: data.MAZE,
        GAME_EQUIP: data.GAME_EQUIP,
        ZSP: data.ZSP,
        OTOM:data.OTOM,
      });
      console.log("contracts",data);
    } catch (error) {
      console.error('Error fetching contracts:', error);
    }
  };

  // Handlers for quantity
  const handleIncrease = () => {
    if (quantity < maxAmount) {
      setQuantity(quantity + 1);
      setTotalPrice((quantity+1)*price)
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      setTotalPrice((quantity-1)*price)
    }
  };

  const handleMint = () => {
    alert(`Minting ${quantity} items!`);
    // Add minting logic here
  };

  useEffect(() => {
    fetchContracts();
    refetch();

  }, [network]);

  useEffect(() => {
    if (isLoading) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccess){
      setPopupMsg(`Mint Success! Head the "Play" tab to enter the game! `);
      refetch();
    }


  }, [isLoading,isSuccess,isPrepareError]); 
  

  return (
    <div className={styles.container}>
      {/* Left Section */}
      {/* <div className={styles.left}>

        <div className={styles.topImage}><img src="images/nft/circle/1.png"></img></div>
        <div className={styles.bottomImages}>
          <div className={styles.bottomImage}> <img src="images/nft/circle/2.png"></img></div>
          <div className={styles.bottomImage}><img src="images/nft/circle/3.png"></img></div>
          <div className={styles.bottomImage}><img src="images/nft/circle/4.png"></img></div>
        </div>

      </div> */}
      <ImageRotator></ImageRotator>
      <ChainInfo onNetworkReady={setNetwork} />
     
      {/* Right Section */}
      <div className={styles.right}>
        <h1 className={styles.title}>PUBLIC MINT</h1>

            {/* Icons Row */}
            <div className={styles.iconsRow}>
            {Array.from({ length: quantity }).map((_, index) => (
                <img
                key={index}
                src="icons/pacs/pac.png"
                alt={`Icon ${index + 1}`}
                className={styles.icon}
                />
            ))}
            </div>
        {/* Quantity Selector */}
        <div className={styles.quantitySelector}>
          <button className={styles.quantityButton} onClick={handleDecrease}>-</button>
          <input
            className={styles.quantityInput}
            type="text"
            value={quantity}
            readOnly
          />
          <button className={styles.quantityButton} onClick={handleIncrease}>+</button>
        </div>

        {/* Text Section */}
        <div className={styles.textSection}>
          <span className={styles.leftText}>Max {maxAmount}</span>
          <span className={styles.rightText}>
            {currentSupply}/{totalSupply} Minted
          </span>
        </div>

        {/* Mint Button */}
        <button className={styles.mintButton} disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()}>
          MINT
          <div className={styles.pricetag}>{ weiToEth(totalprice)} ETH</div>
        </button>
      </div>
    </div>
  );
};

export default MintComponent;
