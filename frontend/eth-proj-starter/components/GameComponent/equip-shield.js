import React, { useState, useEffect } from 'react';
import styles from './equip.module.css';
import webconfig from '../config/config.js';
import { useAccount } from 'wagmi';  
import gameEquipABI from '../abi/game-equip-abi.js';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';

const CountdownShield = ({ shieldExpireTime}) => {
    const [status, setStatus] = useState("");

    const computeShield = () => {
        const currentTime = Date.now() / 1000; // Current time in seconds



        if (currentTime < shieldExpireTime) {
            // Player is shielded
            const shieldEndTime = shieldExpireTime;
            const timeLeft = shieldEndTime - currentTime;

            const hours = Math.floor(timeLeft / 3600);
            const minutes = Math.floor((timeLeft % 3600) / 60);
            const seconds = Math.ceil(timeLeft % 60);

            return `You are shielded for the next [${hours} hr ${minutes} min ${seconds} sec]`;

        }

        // Player is not shielded
        return "You are not shielded";
    };

    useEffect(() => {
        // Update the status every second
        const interval = setInterval(() => {
            setStatus(computeShield());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [shieldExpireTime]);

    return <div>{status}</div>;
};


const EquipShield = ({ contracts,currplayerid, playerData, network ='shape-sepolia',setPopupMsg}) => {
    const { address } = useAccount();
    const [nfts, setNfts] = useState([]);
    const [selectedTokenId, setSelectedTokenId] = useState(null);
    const [selectedTokenUsed,setSelectedTokenUsed]=useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const {
        config: config_equip,
        error: prepareError,
        isError: isPrepareError,
      } = usePrepareContractWrite({
        address: contracts.GAME_EQUIP, // Address for your GAME contract
        abi: gameEquipABI, // ABI of the contract
        functionName: 'shield', // Function name
        args: [selectedTokenId,currplayerid], // Arguments for the function
    
      });
    
      // Contract write hook
      const { data, write } = useContractWrite(config_equip);
    
      // Wait for transaction to complete
      const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      });

    //   APPROVE
      const {
        config: config_approve,
        error: prepareError2,
        isError: isPrepareError2,
      } = usePrepareContractWrite({
        address: contracts.OTOM, // Address for your GAME contract
        abi: [
            {
                "inputs": [
                    {
                        "internalType": "address",
                        "name": "operator",
                        "type": "address"
                    },
                    {
                        "internalType": "bool",
                        "name": "approved",
                        "type": "bool"
                    }
                ],
                "name": "setApprovalForAll",
                "outputs": [],
                "stateMutability": "nonpayable",
                "type": "function"
            }
          ], // ABI of the contract
        functionName: 'setApprovalForAll', // Function name
        args: [contracts.GAME_EQUIP,true], // Arguments for the function
    
      });
    
      // Contract write hook
      const { data:data2, write:write2 } = useContractWrite(config_approve);
    
      // Wait for transaction to complete
      const { isLoading:isLoading2, isSuccess:isSuccess2 } = useWaitForTransaction({
        hash: data2?.hash,
      });


    

    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${webconfig.apiBaseUrl}/getOTOMMoleculeByOwner?owner=${address}&network=${network}&withMetadata=true`);

                if (!response.ok) throw new Error('Failed to fetch NFT data');
                const data = await response.json();
                setNfts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (address) {
            fetchNFTs();
        }
    }, [address, contracts, network]);

    useEffect(() => { 

        const fetchTokenUsed = async (selectedTokenId) => {
            setLoading(true);
            try {
                const response = await fetch(`${webconfig.apiBaseUrl}/eyesUsed?tokenid=${selectedTokenId}&network=${network}`);

                if (!response.ok) throw new Error('Failed to fetch NFT data');
                const data = await response.json();
                setSelectedTokenUsed(data.used);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if(selectedTokenId==null){
            setSelectedTokenUsed(false);
        }
        else{
            fetchTokenUsed(selectedTokenId);
        }
        //fetch if token is used

    },[selectedTokenId]);

    const handleSelection = (tokenId) => {
        setSelectedTokenId(tokenId === selectedTokenId ? null : tokenId);
    };

    useEffect(() => {
        if (isLoading) {
          setPopupMsg(`Waiting for transaction to confirm`);
        }
        if(isSuccess){
          setPopupMsg(`Shield Success!`);
        }
    
    
      }, [isLoading,isSuccess,isPrepareError]); 

    const computeShieldTime = (nft) =>{
        const hardness=parseFloat(nft.hardness);
        const toughness=parseFloat(nft.toughness);
       
        const totalSeconds = parseInt((hardness + toughness) * 3600);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);

        return `${hours} hr ${minutes} min`;
    }


    if (!address) {
        return (
            <div className={styles.infoText2}>
                Please connect your wallet first
            </div>
        );
    }
    if (!currplayerid) {
        return (
            <div className={styles.infoText2}>
                Please select a player on the upper right and join the game first
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Send OTOM To Increase Shield Time</h1>
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && (
                <>
                    {nfts.length > 0 ? (
                        <>
                        <div className={styles.infoText}>
                            <CountdownShield shieldExpireTime={playerData.shieldExpireTime}></CountdownShield>
                            You may increase shield time to max 24 hours.
                        </div>
                        <div className={styles.infoText}>
                            You hold <span className={styles.hightlight}>{nfts.length}</span> OTOM Molecules
                        </div>
                        <div className={styles.infoText}>Please select a token: </div>
                        </>
                    ) : (
                        <p className={styles.infoText}>You don't hold any OTOM Molecules yet. Combine OTOM to make molecules</p>
                    )}
                    <ul className={styles.nftList}>
                        {nfts.map((nft, index) => (
                            <li
                                key={index}
                                className={`${styles.nftItem} ${styles.OTOMnftItem}  ${
                                    selectedTokenId === nft.tokenId ? styles.selected : ''
                                }`}
                                onClick={() => handleSelection(nft.tokenId)}
                            >
                                <img className={styles.nftimage} src={nft.image}></img>
                                 {nft.name} ({nft.balance})
                                <div className={styles.nfttime}>Shield Time: + {computeShieldTime(nft)}</div>
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {selectedTokenUsed && <div className={styles.infoText}>The selected token has been used</div>}

            <button className={styles.submitButton} disabled={!write2 || isLoading2 || isPrepareError2}
                    onClick={() => write2?.()}>
                {isLoading ? 'Approving' : `Approve OTOM Transfer`}
            </button>

            <button className={styles.submitButton} disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()}>
                {isLoading ? 'Equiping' : `Transfer OTOM to Shield Player ${currplayerid}`}
            </button>



        </div>
    );
};

export default EquipShield;
