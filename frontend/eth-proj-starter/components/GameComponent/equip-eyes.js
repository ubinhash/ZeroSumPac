import React, { useState, useEffect } from 'react';
import styles from './equip.module.css';
import webconfig from '../config/config.js';
import { useAccount } from 'wagmi';  
import gameEquipABI from '../abi/game-equip-abi.js';
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi';
const EquipEyes = ({ contracts,currplayerid, network ='shape-mainnet',setPopupMsg,onEquipSuccess}) => {
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
        functionName: 'equipEyes', // Function name
        args: [currplayerid,selectedTokenId], // Arguments for the function
    
      });
    
      // Contract write hook
      const { data, write } = useContractWrite(config_equip);
    
      // Wait for transaction to complete
      const { isLoading, isSuccess } = useWaitForTransaction({
        hash: data?.hash,
      });


    useEffect(() => {
        const fetchNFTs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${webconfig.apiBaseUrl}/getEyeByOwner?owner=${address}&network=${network}&withMetadata=false`);

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
          setPopupMsg(`Equip Success!`);
        }
    
    
      }, [isLoading,isSuccess,isPrepareError]); 

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
            <h1 className={styles.title}>Equip Eyes To Increase Stride</h1>
            {loading && <p className={styles.loading}>Loading...</p>}
            {error && <p className={styles.error}>{error}</p>}
            {!loading && !error && (
                <>
                    {nfts.length > 0 ? (
                        <>
                        <div className={styles.infoText}>
                            You hold <span className={styles.hightlight}>{nfts.length}</span> eyes 
                        </div>
                        <div className={styles.infoText}>Please select a token: </div>
                        </>
                    ) : (
                        <p className={styles.infoText}>You don't hold any Shapecraft Eyes NFT yet.</p>
                    )}
                    <ul className={styles.nftList}>
                        {nfts.map((nft, index) => (
                            <li
                                key={index}
                                className={`${styles.nftItem} ${
                                    selectedTokenId === nft.tokenId ? styles.selected : ''
                                }`}
                                onClick={() => handleSelection(nft.tokenId)}
                            >
                                Token ID: {nft.tokenId}
                            </li>
                        ))}
                    </ul>
                </>
            )}
            {selectedTokenUsed && <div className={styles.infoText}>The selected token has been used</div>}
            <button className={styles.submitButton} disabled={!write || isLoading || isPrepareError}
                    onClick={() => write?.()}>
                {isLoading ? 'Equiping' : `Equip Eyes for Player ${currplayerid}`}
            </button>
            <div className={styles.fineprint}> EYE Contract: {contracts.EYE}</div>
        </div>
    );
};

export default EquipEyes;
