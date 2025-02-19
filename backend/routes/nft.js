const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
// router.get('/getNFTByOwner', async (req, res) => {
//     const { owner, contract,withMetadata = "false" } = req.query;

//     if (!owner || !contract || !withMetadata) {
//         return res.status(400).json({ error: "Missing required parameters: owner and contract" });
//     }

//     try {
//         // const withMetadata = "false";
//         const url = `https://shape-mainnet.g.alchemy.com/nft/v3/${process.env.ALCHEMY_API_KEY}/getNFTsForOwner?owner=${owner}&contractAddresses[]=${contract}&withMetadata=${withMetadata}&pageSize=100`;

//         const headers = { accept: "application/json" };
//         const response = await axios.get(url, { headers });
//        console.error(url)
//         res.json(response.data);
//     } catch (error) {
//         console.error(error.message);
//         res.status(500).json({ error: "Failed to fetch NFT data" });
//     }
// });

const CONTRACTS = {
    'shape-mainnet': {
        OTOM: "0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3",
        PAC: process.env.ZSP_MAINNET,// "0x7564e43e59A14823d5D66e86c98C0AaB9d96743E",
        KEY:"0x05aA491820662b131d285757E5DA4b74BD0F0e5F",
        EYE:"0xF3851e1b7824BD920350E6Fe9B890bb76d01C9f7"
    },
    'shape-sepolia': {
        OTOM: "0xc709F59f1356230025d4fdFDCeD92341A14FF2F8",  // Replace with actual Sepolia OTOM contract address
        PAC: process.env.ZSP_SEPOLIA,     // Replace with actual Sepolia PAC contract address
        KEY:"0x01eB5CF188ba7d075FDf7eDF2BB8426b17CA3320",
        EYE:"0xAA394da7d62E502a7E3dA7e11d21A74c277143d5",
    }
};



const getNFTByOwner = async (owner, contract, withMetadata, network) => {
    const API_KEY = process.env.ALCHEMY_API_KEY;
    let pageKey = "1";  // Start with page 1
    let hasNextPage = true;  // Flag to control the loop
    let nfts = [];  // Array to store all NFTs
    let pageCount = 0;  // Counter to limit pages to a maximum of 5

    const headers = {
        accept: "application/json",
    };

    try {
        while (hasNextPage && pageCount < 5) {  // Limit to 5 pages
            const url = `https://${network}.g.alchemy.com/nft/v3/${API_KEY}/getNFTsForOwner?owner=${owner}&contractAddresses[]=${contract}&withMetadata=${withMetadata}&pageSize=100&pageKey=${pageKey}`;
            // console.log(url);  

            const response = await axios.get(url, { headers });

            // Assuming the response data contains 'pageKey' and 'ownedNfts'
            const jsonResult = response.data;
            pageKey = jsonResult.pageKey;  // Update the pageKey
            nfts = [...nfts, ...jsonResult.ownedNfts];  // Append the new NFTs to the existing array

            // If pageKey is empty, there are no more pages
            hasNextPage = !!pageKey;
            pageCount++;  // Increment the page counter
        }

        return nfts;  // Return all the collected NFTs
    } catch (error) {
        console.error("Error in getNFTByOwner:", error.message);
        throw error.response?.data || new Error("Failed to fetch NFT data");
    }
};
// Helper to extract trait values from attributes
const getTraitValue = (traits, traitType) => {
    if (!traits || !Array.isArray(traits)) return ""; // Handle invalid or missing attributes
    for (const trait of traits) {
        if (trait.trait_type === traitType) {
            return trait.value || ""; // Default to empty string if value is not present
        }
    }
    return ""; // Return empty string if trait_type is not found
};

// Function to parse molecule info
const parseMoleculeInfo = (nfts) => {
    const moleculesInfo = [];

    for (const nft of nfts) {
        const attributes = nft.raw?.metadata?.attributes;
        const bondValue = getTraitValue(attributes, "Bond Type");
        const toughness = getTraitValue(attributes, "Toughness");
        const hardness = getTraitValue(attributes, "Hardness");

        // Add to moleculesInfo if bondValue exists and is not 'singleton'
        if (bondValue && bondValue !== "singleton") {
            moleculesInfo.push({
                tokenId: nft.tokenId,
                name: nft.raw?.metadata?.name || "",
                balance: nft.balance || "",
                image: nft.raw?.metadata?.image || "",
                toughness,
                hardness,
            });
        }
    }

    return moleculesInfo;
};

const parseNFTInfo = (nfts) => {
    const nftInfo = [];

    for (const nft of nfts) {



        // Add to moleculesInfo if bondValue exists and is not 'singleton'
        nftInfo.push({
            tokenId: nft.tokenId,
            contract:nft.contract.address,
            name: nft.raw?.metadata?.name || nft.contract.name + " #" + nft.tokenId,
            balance: nft.balance || "",
            image: nft.raw?.metadata?.image || "",
        });
        
    }

    return nftInfo;
};



router.get('/getOTOMByOwner', async (req, res) => {
    const { owner, withMetadata = "false",network="shape-mainnet" } = req.query;

    if (!owner) {
        return res.status(400).json({ error: "Missing required parameter: owner" });
    }
    if (!['shape-mainnet', 'shape-sepolia'].includes(network)) {
        return res.status(400).json({ error: "Invalid network. Allowed values are 'shape-mainnet' or 'shape-sepolia'" });
    }
    const contract = CONTRACTS[network]?.OTOM;
    if (!contract) {
        return res.status(500).json({ error: `Contract not found for OTOM on network ${network}` });
    }
    try {
        const nftData = await getNFTByOwner(owner, contract, withMetadata,network);
        res.json(nftData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getOTOMMoleculeByOwner', async (req, res) => {
    const { owner, withMetadata = "true",network="shape-mainnet" } = req.query;

    if (!owner) {
        return res.status(400).json({ error: "Missing required parameter: owner" });
    }
    if (!['shape-mainnet', 'shape-sepolia'].includes(network)) {
        return res.status(400).json({ error: "Invalid network. Allowed values are 'shape-mainnet' or 'shape-sepolia'" });
    }
    const contract = CONTRACTS[network]?.OTOM;
    if (!contract) {
        return res.status(500).json({ error: `Contract not found for OTOM on network ${network}` });
    }
    try {
        const nftData = await getNFTByOwner(owner, contract, withMetadata,network);
        const moleculesInfo = parseMoleculeInfo(nftData);
        res.json(moleculesInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getPacByOwner', async (req, res) => {
    const { owner, withMetadata = "true",network="shape-mainnet"} = req.query;

    if (!owner) {
        return res.status(400).json({ error: "Missing required parameter: owner" });
    }
    if (!['shape-mainnet', 'shape-sepolia'].includes(network)) {
        return res.status(400).json({ error: "Invalid network. Allowed values are 'shape-mainnet' or 'shape-sepolia'" });
    }
    const contract = CONTRACTS[network]?.PAC;
    // console.log(contract);
    if (!contract) {
        return res.status(500).json({ error: `Contract not found for PAC on network ${network}` });
    }

    try {
        const nftData = await getNFTByOwner(owner, contract, withMetadata,network);
        const nftInfo = parseNFTInfo(nftData);
        res.json(nftInfo);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getKeyByOwner', async (req, res) => {
    const { owner, withMetadata = "true",network="shape-mainnet"} = req.query;

    if (!owner) {
        return res.status(400).json({ error: "Missing required parameter: owner" });
    }
    if (!['shape-mainnet', 'shape-sepolia'].includes(network)) {
        return res.status(400).json({ error: "Invalid network. Allowed values are 'shape-mainnet' or 'shape-sepolia'" });
    }
    const contract = CONTRACTS[network]?.KEY;
    // console.log(contract);
    if (!contract) {
        return res.status(500).json({ error: `Contract not found for PAC on network ${network}` });
    }

    try {
        const nftData = await getNFTByOwner(owner, contract, withMetadata,network);
        // const nftInfo = parseNFTInfo(nftData);
        res.json(nftData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/getEyeByOwner', async (req, res) => {
    const { owner, withMetadata = "true",network="shape-mainnet"} = req.query;

    if (!owner) {
        return res.status(400).json({ error: "Missing required parameter: owner" });
    }
    if (!['shape-mainnet', 'shape-sepolia'].includes(network)) {
        return res.status(400).json({ error: "Invalid network. Allowed values are 'shape-mainnet' or 'shape-sepolia'" });
    }
    const contract = CONTRACTS[network]?.EYE;
    // console.log(contract);
    if (!contract) {
        return res.status(500).json({ error: `Contract not found for PAC on network ${network}` });
    }

    try {
        const nftData = await getNFTByOwner(owner, contract, withMetadata,network);
        // const nftInfo = parseNFTInfo(nftData);
        res.json(nftData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
