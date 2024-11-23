const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();
const { Web3 } = require('web3');
const CONTRACTS = {
    'shape-mainnet': {
        GAME: "TODO",
    },
    'shape-sepolia': {
        GAME: process.env.GAME_SEPOLIA     // Replace with actual Sepolia PAC contract address
    }
};



// Initialize Web3 provider (replace with your actual provider URL)


// ABI of your contract
const GAME_ABI = [
    {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "DAILY_MOVES_FOR_LEVELS",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "DOTS_REQUIRED_FOR_LEVELS",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
];


router.get('/getConfig', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    const gamecontract = CONTRACTS[network]?.GAME;
    console.log(gamecontract)
    const web3 = new Web3(process.env.RPC_SEPOLIA);
    console.log(process.env.RPC_SEPOLIA)
    if (!gamecontract) {
        return res.status(500).json({ error: `Contract not found for GAME on ${network}` });
    }

    const game = new web3.eth.Contract(GAME_ABI, gamecontract);

    try {
        const dotsRequired = [];
        const dailyMoves = [];

        for (let i = 0; i < 5; i++) { // Assuming you want levels 0-4
            const dots = await game.methods.DOTS_REQUIRED_FOR_LEVELS(i).call();
            const moves = await game.methods.DAILY_MOVES_FOR_LEVELS(i).call();
            dotsRequired.push(dots);
            dailyMoves.push(moves);
    
        }
        console.log( dotsRequired)
        console.log(dailyMoves)
        const formatBigIntArray = (arr) => arr.map(value => value.toString());
        res.send({
            dotsRequired: formatBigIntArray(dotsRequired),
            dailyMoves: formatBigIntArray(dailyMoves)
        });
    } catch (error) {
        console.error('Error fetching game config:', error.message);
        throw error;
    }

    // res.send(gamecontract);
});

module.exports = router;
