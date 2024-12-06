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
        GAME: process.env.GAME_SEPOLIA ,    // Replace with actual Sepolia PAC contract address
        MAZE : process.env.MAZE_SEPOLIA ,
        GAME_EQUIP:process.env.GAME_EQUIP_SEPOLIA,
        ZSP:process.env.ZSP_SEPOLIA,
        OTOM:"0xc709F59f1356230025d4fdFDCeD92341A14FF2F8",
    }
};



// Initialize Web3 provider (replace with your actual provider URL)


// ABI of your contract
const GAME_ABI = require('./GameABI.json');
const GAMEEQUIP_ABI = require('./GameEquipABI.json');
const MAZE_ABI = require('./MazeABI.json');

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
    "ROB_PERCENTAGE": 10,
    "VULNERABLE_INTERVAL":600
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

        for (let i = 0; i < 6; i++) { // Assuming you want levels 0-4
            const dots = await game.methods.DOTS_REQUIRED_FOR_LEVELS(i).call();
            const moves = await game.methods.DAILY_MOVES_FOR_LEVELS(i).call();
            dotsRequired.push(dots);
            dailyMoves.push(moves);
    
        }
        // console.log( dotsRequired)
        // console.log(dailyMoves)
        const formatBigIntArray = (arr) => arr.map(value => value.toString());
        const eatPercentageKey = 9;
        const eatPercentage = await game.methods.getConfigUint(eatPercentageKey).call();
        res.send({
            config: {
                ...static_config,
                EAT_PERCENTAGE: eatPercentage.toString() // Override the static value
            },
            dotsRequired: formatBigIntArray(dotsRequired),
            dailyMoves: formatBigIntArray(dailyMoves)
        });
    } catch (error) {
        console.error('Error fetching game config:', error.message);
        throw error;
    }

    // res.send(gamecontract);
});

router.get('/getContracts', async (req, res) => {
    const {network="shape-sepolia" } = req.query;
    res.send(CONTRACTS[network]);
});

router.get('/getDotConsumed', async (req, res) => {
    const { network = "shape-sepolia",maze_number = 0 } = req.query;

    const gameContractAddress = CONTRACTS[network]?.GAME;
    const mazeContractAddress = CONTRACTS[network]?.MAZE;

    if (!gameContractAddress || !mazeContractAddress) {
        return res.status(500).json({ error: `Contract not found for GAME or MAZE on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;
    
    try {
        // Instantiate the contracts
        const gameContract = new web3.eth.Contract(GAME_ABI, gameContractAddress);
        const mazeContract = new web3.eth.Contract(MAZE_ABI, mazeContractAddress);

        // Fetch values from the Game contract
        const level3DotsLocked = await gameContract.methods.level3DotsLocked().call();
        const level4DotsLocked = await gameContract.methods.level4DotsLocked().call();
        const totalDotsConsumed = await mazeContract.methods.total_dots_consumed().call();
        const totalDotsInMaze = await mazeContract.methods.total_dots_in_mazes().call();
        const mazeDotsConsumed = await mazeContract.methods.maze_dots_consumed(maze_number).call();

        // Send response with fetched values
        res.send({
            mazeDotsConsumed: mazeDotsConsumed.toString(),
            level3DotsLocked: level3DotsLocked.toString(),
            level4DotsLocked: level4DotsLocked.toString(),
            totalDotsConsumed: totalDotsConsumed.toString(),
            totalDotsInMaze: totalDotsInMaze.toString(),
        });

    } catch (error) {
        console.error('Error fetching game and maze info:', error.message);
        res.status(500).json({ error: 'Failed to fetch game and maze info', details: error.message });
    }
});

const getMazeUnlockRequirements = async (mazeContract) => {
    const mazeUnlockRequirements = [];
    
    try {
        // Fetch the arrays of mint required and dots required
      
        // Construct requirements for mazes 0-4 (based on mint required)
        for (let i = 0; i < 5; i++) {
            const mintRequiredValue = await mazeContract.methods.MAZE_UNLOCK_MINT_REQUIRED(i).call();
            mazeUnlockRequirements.push(`Unlockable after ${mintRequiredValue} PAC is minted`);
        }

        // Construct requirements for mazes 5-8 (based on dots required)
        for (let i = 5; i < 9; i++) {
            const dotsRequiredValue = await mazeContract.methods.MAZE_UNLOCK_DOTS_REQUIRED(i).call();
            mazeUnlockRequirements.push(`Unlockable after ${dotsRequiredValue} dots are consumed in total`);
        }

        mazeUnlockRequirements.push(`Unlockable after your player equip a shapecraft key`);

    } catch (error) {
        console.error('Error fetching maze unlock requirements:', error.message);
    }

    return mazeUnlockRequirements;
};

router.get('/getMazeUnlock', async (req, res) => {
    const { network = "shape-sepolia",playerid=0 } = req.query;
  

    const mazeContractAddress = CONTRACTS[network]?.MAZE;

    if (!mazeContractAddress) {
        return res.status(500).json({ error: `Contract not found for MAZE on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;
    
    try {
        // Instantiate the Maze contract
        const mazeContract = new web3.eth.Contract(MAZE_ABI, mazeContractAddress);

        // Fetch maze unlock statuses
        const mazeUnlockedStatuses = [];
        for (let i = 0; i < 10; i++) { // Total Mazes = 10
            const mazeUnlocked = await mazeContract.methods._isMazeUnlocked(i,playerid).call();
            mazeUnlockedStatuses.push(mazeUnlocked);
        }

        const mazeUnlockRequirements = await getMazeUnlockRequirements(mazeContract);
        // Send response with the maze unlock statuses
        res.send({
            mazeUnlockedStatuses, // Array of booleans for each maze (0 to 9)
            mazeUnlockRequirements 
        });

    } catch (error) {
        console.error('Error fetching maze unlock statuses:', error.message);
        res.status(500).json({ error: 'Failed to fetch maze unlock statuses', details: error.message });
    }
});

router.get('/getPlayerId', async (req, res) => {
    const { network = "shape-sepolia", contract, tokenid } = req.query;

    if (!contract || !tokenid) {
        return res.status(400).json({ error: "Missing contractAddress or tokenId parameter" });
    }
    const gameContractAddress = CONTRACTS[network]?.GAME; // Adjust if the mapping is in a different contract
    if (!gameContractAddress) {
        return res.status(500).json({ error: `Contract not found for GAME on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the contract
        const gameContract = new web3.eth.Contract(GAME_ABI, gameContractAddress);

        // Call the mapping with the provided parameters
        const playerId = await gameContract.methods.nft_to_playerid(contract, tokenid).call();

        // Send the result
        res.send({ playerId: playerId.toString() });
    } catch (error) {
        console.error('Error fetching playerId from nft_to_playerid:', error.message);
        res.status(500).json({ error: 'Failed to fetch playerId', details: error.message });
    }
});

router.get('/getMaxStride', async (req, res) => {
    const { network = "shape-sepolia",playerid } = req.query;

    // Validate input
    if (!playerid) {
        return res.status(400).json({ error: "Missing playerId parameter" });
    }

    // Get the appropriate Maze contract address
    const mazeContractAddress = CONTRACTS[network]?.MAZE;
    if (!mazeContractAddress) {
        return res.status(500).json({ error: `Contract not found for MAZE on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the Maze contract
        const mazeContract = new web3.eth.Contract(MAZE_ABI, mazeContractAddress);

        // Call the _getMaxStride function with the given playerId
        const maxStride = await mazeContract.methods._getMaxStride(playerid).call();

        // Send the response as a string
        res.send({ maxStride: maxStride.toString() });
    } catch (error) {
        console.error('Error fetching maxStride from Maze contract:', error.message);
        res.status(500).json({ error: 'Failed to fetch maxStride', details: error.message });
    }
});


router.get('/getPlayerInfo', async (req, res) => {
    const { network = "shape-sepolia", playerid } = req.query;

    // Validate input
    if (!playerid) {
        return res.status(400).json({ error: "Missing playerid parameter" });
    }

    const gameContractAddress = CONTRACTS[network]?.GAME;
    if (!gameContractAddress) {
        return res.status(500).json({ error: `Contract not found for GAME on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the Game contract
        const gameContract = new web3.eth.Contract(GAME_ABI, gameContractAddress);

        // Fetch player information from the contract
        const playerInfo = await gameContract.methods.players(playerid).call();
        const statusMapping = {
            "0": "Inactive",
            "1": "Active",
            "2": "LockedIn",
            "3": "Forfeit",
            "4": "Eliminated"
        };

        // Convert BigInt values to strings
        const formattedPlayerInfo = {
            playerid:playerid,
            playerPosition: {
                x: playerInfo.playerposition.x.toString(),
                y: playerInfo.playerposition.y.toString(),
                maze: playerInfo.playerposition.maze.toString(),
            },
            dots: playerInfo.dots.toString(),
            level: playerInfo.level.toString(),
            nextMoveTime: playerInfo.nextMoveTime.toString(),
            nextSwitchMazeTime: playerInfo.nextSwitchMazeTime.toString(),
            shieldExpireTime: playerInfo.shieldExpireTime.toString(),
            protectionExpireTime: playerInfo.protectionExpireTime.toString(),
            vulnerableTime: playerInfo.vulnerableTime.toString(),
            nftContract: playerInfo.nftContract,
            tokenId: playerInfo.tokenId.toString(),
            moveInfo: {
                day: playerInfo.moveInfo.day.toString(),
                move: playerInfo.moveInfo.move.toString(),
            },
            statusCode: playerInfo.status.toString(), // Assuming it's a BigInt or number
            status:statusMapping[playerInfo.status.toString()] 
        };

        // Send the formatted response
        res.json(formattedPlayerInfo);
    } catch (error) {
        console.error('Error fetching player info:', error.message);
        res.status(500).json({ error: 'Failed to fetch player info', details: error.message });
    }
});

router.get('/getTopVoted', async (req, res) => {
    const { network = "shape-sepolia",playerid=0 } = req.query;



    // Get the appropriate Maze contract address
    const gameEquipContractAddress = CONTRACTS[network]?.GAME_EQUIP;
    if (!gameEquipContractAddress) {
        return res.status(500).json({ error: `Contract not found for Game Equip on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the Maze contract
        const gameEquipContract = new web3.eth.Contract(GAMEEQUIP_ABI, gameEquipContractAddress);
        const today=    Math.floor(Date.now() / 1000 /86400);
        const tommorow=    Math.floor(Date.now() / 1000 /86400)+1;

        // Call the _getMaxStride function with the given playerId
        const governer = await gameEquipContract.methods.topVotedPlayer(today).call();
        const topVotedPlayer = await gameEquipContract.methods.topVotedPlayer(tommorow).call();
        const topVotedCount = await gameEquipContract.methods.topVotedCount(tommorow).call();
        const playerVotedCount = await gameEquipContract.methods.votes(tommorow,playerid).call();
        const playerVoted = await gameEquipContract.methods.voted(tommorow,playerid).call();
        // Send the response as a string
        res.send({ governer:governer.toString(),topVotedPlayer:topVotedPlayer.toString(),topVotedCount:topVotedCount.toString() ,playerVotedCount:playerVotedCount.toString(),playerVoted:playerVoted});
    } catch (error) {
        console.error('Error fetching top voted from contract:', error.message);
        res.status(500).json({ error: 'Failed to fetch top voted', details: error.message });
    }
});

router.get('/keyUsed', async (req, res) => {
    const { network = "shape-sepolia",tokenid } = req.query;
        // Validate input
    if (!tokenid) {
        return res.status(400).json({ error: "Missing tokenid parameter" });
    }


    // Get the appropriate Maze contract address
    const gameEquipContractAddress = CONTRACTS[network]?.GAME_EQUIP;
    if (!gameEquipContractAddress) {
        return res.status(500).json({ error: `Contract not found for Game Equip on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the Maze contract
        const gameEquipContract = new web3.eth.Contract(GAMEEQUIP_ABI, gameEquipContractAddress);
        const used = await gameEquipContract.methods.keysUsed(tokenid).call();

        // Send the response as a string
        res.send({used:used});
    } catch (error) {
        console.error('Error fetching top voted from contract:', error.message);
        res.status(500).json({ error: 'Failed to fetch top voted', details: error.message });
    }
});

router.get('/eyesUsed', async (req, res) => {
    const { network = "shape-sepolia",tokenid } = req.query;
        // Validate input
    if (!tokenid) {
        return res.status(400).json({ error: "Missing tokenid parameter" });
    }


    // Get the appropriate Maze contract address
    const gameEquipContractAddress = CONTRACTS[network]?.GAME_EQUIP;
    if (!gameEquipContractAddress) {
        return res.status(500).json({ error: `Contract not found for Game Equip on ${network}` });
    }

    const web3 = network === "shape-mainnet" ? web3Mainnet : web3Sepolia;

    try {
        // Instantiate the Maze contract
        const gameEquipContract = new web3.eth.Contract(GAMEEQUIP_ABI, gameEquipContractAddress);
        const eyesInfo = await gameEquipContract.methods.eyesInfo(tokenid).call();

        // Send the response as a string
        res.send({used:eyesInfo.isEquipped,playerId: eyesInfo.playerId.toString(),equipTime: eyesInfo.equipTime.toString()});
    } catch (error) {
        console.error('Error fetching top voted from contract:', error.message);
        res.status(500).json({ error: 'Failed to fetch top voted', details: error.message });
    }
});



//Function to get player info (player location, dots ranks etc)
//function to get isCurrentMazeUnlockedForPlayer returns array[] DONE
//GET PLAYER MAX STRIDE DONE
//function to get dotlocked in for lvl3, lv4 total  DONE
//dot consumed for maze DONE


// function to get ranking
// function to get recent event logs?

module.exports = router;
