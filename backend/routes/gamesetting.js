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

const web3Mainnet = new Web3(process.env.RPC_MAINNET);
const web3Sepolia = new Web3(process.env.RPC_SEPOLIA);
const static_config = {
    "FIRST_ENTRANCE_MOVE_INTERVAL": 60,
    "MOVE_INTERVAL": 10,
    "PROTECTION_INTERVAL": 43200,
    "MAX_SHIELD_INTERVAL": 86400,
    "MAZE_SWITCH_INTERVAL": 604800,
    "MAZE_SWITCH_PENALTY": "1000000000000000",  //0.001 eth
    "SHIELD_PRICE": "50000000000000",       //0.00005 eth
    "MIN_LOCK_IN_LV": 3,
    "MIN_SHIELD_LV": 3,
    "EAT_PERCENTAGE": 10,
    "ROB_PERCENTAGE": 10
};

router.get('/getConfig', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    const gamecontract = CONTRACTS[network]?.GAME;
    console.log(gamecontract)
    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

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
            config:static_config,
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
