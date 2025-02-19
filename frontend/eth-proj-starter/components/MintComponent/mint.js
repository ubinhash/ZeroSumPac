import React, { useState,useEffect } from 'react';
import styles from './mint.module.css';
import ChainInfo from '../network';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction ,useContractRead} from 'wagmi';
import ZSPABI from '../abi/zsp-abi.js';
import webconfig from '../config/config.js';
import whitelist from './whitelist.js'
import { useAccount } from 'wagmi';  
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



  const Countdown = ({ targetTimestamp ,text}) => {
    const [timeLeft, setTimeLeft] = useState(null); // Start with null to avoid SSR mismatch
  
    useEffect(() => {
      setTimeLeft(calculateTimeLeft(targetTimestamp)); // Initialize after mount
  
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft(targetTimestamp));
      }, 1000);
  
      return () => clearInterval(timer);
    }, [targetTimestamp]);
  
    function calculateTimeLeft(target) {
      const now = Math.floor(Date.now() / 1000);
      let diff = target - now;
      
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  
      const days = Math.floor(diff / 86400);
      diff %= 86400;
      const hours = Math.floor(diff / 3600);
      diff %= 3600;
      const minutes = Math.floor(diff / 60);
      const seconds = diff % 60;
  
      return { days, hours, minutes, seconds };
    }
  
    if (!timeLeft) return null; // Prevent rendering on the server
  
    return (
      <div className={styles.countdownText}>
        {text}
        <span className={styles.number}>{timeLeft.days}</span> DAY{" "}
        <span className={styles.number}>{timeLeft.hours}</span> HR{" "}
        <span className={styles.number}>{timeLeft.minutes}</span> MIN{" "}
        <span className={styles.number}>{timeLeft.seconds}</span> SEC
      </div>
    );
  };
  

  

  


const MintComponent = ({setPopupMsg}) => {
  // Local state variables
  const [network, setNetwork] = useState('shape-mainnet'); 
  const [quantity, setQuantity] = useState(1); // Default starting quantity
  const [publicPrice,setPublicPrice]=useState(18000000000000000);
  const [wlPrice,setWLPrice]=useState(15000000000000000);
  const [price, setPrice] = useState(publicPrice);
  const [publicStartTime, setPublicStartTime] = useState(1739808000); // Example timestamp 1739808000
  const [whitelistStartTime, setWhitelistStartTime] = useState(1739721600); // 1739721600
  const [title, setTitle] = useState("Minting Soon"); 
  const [alertText, setAlertText] = useState("Please Connect Your Wallet"); 

  const [totalPrice, setTotalPrice] = useState(0);

  const { address } = useAccount();
  const [hasWhitelist, setHasWhitelist] = useState(false);
  const [proof,setProof] = useState(null);
  const [showWLMint,setShowWLMint]=useState(false);
  const [showWLCountdown,setShowWLCountdown]=useState(false);

  useEffect(() => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

    if (!address) {
      setAlertText("Please Connect Your Wallet");
    } else if (currentTime < publicStartTime) {
      if (address.toLowerCase() in whitelist) {
        setProof(whitelist[address.toLowerCase()]["proof"])
        setAlertText("You are in the whitelist");
      } else {
        setAlertText("Not in whitelist");
      }
    } else {
      setAlertText(""); // Clear the alert text if currentTime >= publicStartTime
    }
  }, [address, publicStartTime]); 

  useEffect(() => {
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const price = currentTime < publicStartTime ? wlPrice : publicPrice;
    if (currentTime >= publicStartTime) {
      
      setTitle( "PUBLIC MINT");
      setMaxAmount(10)
      setShowWLMint(false);
      setShowWLCountdown(false);
    }
    else if (currentTime >= whitelistStartTime) {
      setTitle( "WHITELIST MINT");
      setMaxAmount(2)
      setShowWLMint(true);
      setShowWLCountdown(false);
    } else {

      setTitle( "MINTING SOON");
      setMaxAmount(2)
      setShowWLMint(true);
      setShowWLCountdown(true);
      
    }
    setPrice(price);
    setTotalPrice(price * quantity);
  }, [publicStartTime, whitelistStartTime, wlPrice, publicPrice, quantity]);


  const [maxAmount,setMaxAmount] = useState(10); // Maximum allowed quantity
  const [currentSupply,setCurrentSupply] = useState(0); // Current minted supply
  const [totalSupply,setTotalSupply] = useState(0); // Current minted supply
  // const totalSupply = 555; // Total supply available
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
    value:totalPrice.toString(),

  });

  const {
    config: config_mint_wl,
    error: prepareError_wl,
    isError: isPrepareError_wl,
  } = usePrepareContractWrite({
    address: contracts.ZSP, // Address for your GAME contract
    abi: ZSPABI, // ABI of the contract
    functionName: 'whitelistMint', // Function name
    args: [quantity,2,proof], // Arguments for the function
    value:totalPrice.toString(),

  });

  // Contract write hook
  // const { data, write } = useContractWrite(config_mint);
  const { data: dataPublic, write: writePublic } = useContractWrite(config_mint);
  const { data: dataWL, write: writeWL } = useContractWrite(config_mint_wl);

  // Wait for transaction to complete
  const { isLoading: isLoadingPublic, isSuccess: isSuccessPublic } = useWaitForTransaction({
    hash: dataPublic?.hash,
  });
  
  const { isLoading: isLoadingWL, isSuccess: isSuccessWL } = useWaitForTransaction({
    hash: dataWL?.hash,
  });
  

  const {data:dataread,refetch} = useContractRead({
    address: contracts.ZSP,
    abi: ZSPABI,
    functionName: 'totalSupply',
    onSettled(data, error) {
        if(data){
          setCurrentSupply(Number(data))
        }
        if(error){
            console.log("failed")
            console.log(error)
        }

    },
  })

  const {data:data_max,refetch:refetch_max} = useContractRead({
    address: contracts.ZSP,
    abi: ZSPABI,
    functionName: 'maxSupply',
    onSettled(data, error) {
        if(data){
          setTotalSupply(Number(data))
        }
        if(error){
            console.log("failed data max")
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

  const handleMax = () => {
    setQuantity(maxAmount);
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
    refetch_max()

  }, [network]);

  useEffect(() => {
    if (isLoadingWL||isLoadingPublic) {
      setPopupMsg(`Waiting for transaction to confirm`);
    }
    if(isSuccessWL){
      setPopupMsg(`Mint Success! Head the "Play" tab to select & view your NFT! `);
      refetch();
      refetch_max()
    }
    if(isSuccessPublic){
      setPopupMsg(`Mint Success! Head the "Play" tab to select & view your NFT! `);
      refetch();
      refetch_max()
      

    }


  }, [isLoadingPublic,isSuccessPublic,isLoadingWL,isSuccessWL]); 
  

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
      {/* {showWLCountdown ?(
      <Countdown targetTimestamp={whitelistStartTime} text="WL MINT IN: "/>):(
       <Countdown targetTimestamp={publicStartTime} text="PUBLIC IN: "/> )} */}
        <h1 className={styles.title}>{title}</h1>
        
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
          <span onClick={handleMax} className={`${styles.leftText} ${styles.maxText}`}>Max {maxAmount} {showWLMint? (""):("/ TX")}</span>
       
          <span className={styles.rightText}>
            {currentSupply}/{totalSupply} Minted
          </span>
        </div>

        {/* Mint Button */}
        {!showWLMint ?(
        <button 
          className={styles.mintButton} 
          disabled={!writePublic || isLoadingPublic || isPrepareError}
          onClick={() => writePublic?.()}
        >
          MINT
          <div className={styles.pricetag}>{weiToEth(totalPrice)} ETH</div>
        </button>
        ):(

        <button 
          className={styles.mintButton} 
          disabled={!writeWL || isLoadingWL || isPrepareError_wl}
          onClick={() => writeWL?.()}
        >
          MINT
          <div className={styles.pricetag}>{weiToEth(totalPrice)} ETH</div>
        </button>
        )}
        {alertText&& <div className={styles.alertText} >{alertText}</div>}

        <a  href="https://relay.link/shape"  className={styles.bridgeText}  target="_blank" rel="noopener noreferrer"> &gt; Bridge ETH to Shape L2 &lt;</a>
        {dataPublic && dataPublic.hash && <a className={styles.txText} href={`https://shapescan.xyz/tx/${dataPublic.hash}`} target="_blank" rel="noopener noreferrer" > View Transaction </a>}
        {dataWL && dataWL.hash && <a className={styles.txText} href={`https://shapescan.xyz/tx/${dataWL.hash}`} target="_blank" rel="noopener noreferrer"> View Transaction </a>}

        <div className={styles.contract}> NFT Contract: <a href={`https://shapescan.xyz/address/${contracts.ZSP}`}  target="_blank" rel="noopener noreferrer">{contracts.ZSP}</a></div>
        <div className={styles.mobileText}> This Site is Optimized For Desktop</div>
      </div>
    </div>
  );
};

export default MintComponent;
