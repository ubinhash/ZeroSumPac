const gameABI = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            }
        ],
        "name": "OwnableInvalidOwner",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "OwnableUnauthorizedAccount",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "bool",
                "name": "isAllowed",
                "type": "bool"
            }
        ],
        "name": "AllowedNFTContract",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "int256",
                "name": "dotdelta",
                "type": "int256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "DotChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "dot",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            }
        ],
        "name": "DotLocked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "ending",
                "type": "uint256"
            }
        ],
        "name": "GameEnded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "NFTRegistered",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "previousOwner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "attackerplayerid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "victimplayerid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "dotdelta",
                "type": "uint256"
            }
        ],
        "name": "PlayerAttacked",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "maze",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "x",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "y",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "PlayerMoved",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "attackerplayerid",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "victimplayerid",
                "type": "uint256"
            }
        ],
        "name": "PlayerRobbed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "enum PlayerStatus",
                "name": "status",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "PlayerStatusChanged",
        "type": "event"
    },
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
    {
        "inputs": [],
        "name": "GAME_ENDED",
        "outputs": [
            {
                "internalType": "enum Ending",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "shieldsecond",
                "type": "uint256"
            }
        ],
        "name": "_addShieldTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "_getPlayerIdAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowedNFTContracts",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "allowedOperators",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "shieldhours",
                "type": "uint256"
            }
        ],
        "name": "buyShield",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            }
        ],
        "name": "checkPlayerId",
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
        "inputs": [],
        "name": "eliminationModeOn",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "endingThreshold",
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
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "maze",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "x",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "y",
                "type": "uint8"
            }
        ],
        "name": "enterGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "destination_playerid",
                "type": "uint256"
            }
        ],
        "name": "forfeit",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Game.ConfigKey",
                "name": "key",
                "type": "uint8"
            }
        ],
        "name": "getConfigUint",
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
        "inputs": [],
        "name": "level3DotsLocked",
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
        "inputs": [],
        "name": "level4DotsLocked",
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
                "name": "playerid",
                "type": "uint256"
            }
        ],
        "name": "lockIn",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "mazeContract",
        "outputs": [
            {
                "internalType": "contract Maze",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "playerid",
                "type": "uint256"
            },
            {
                "internalType": "uint8",
                "name": "maze",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "x",
                "type": "uint8"
            },
            {
                "internalType": "uint8",
                "name": "y",
                "type": "uint8"
            }
        ],
        "name": "movePlayerTo",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "next_player_id",
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
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "nft_to_playerid",
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
        "inputs": [],
        "name": "owner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
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
        "name": "players",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint8",
                        "name": "x",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "y",
                        "type": "uint8"
                    },
                    {
                        "internalType": "uint8",
                        "name": "maze",
                        "type": "uint8"
                    }
                ],
                "internalType": "struct PlayerPosition",
                "name": "playerposition",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "dots",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nextMoveTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "nextSwitchMazeTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "shieldExpireTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "protectionExpireTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "vulnerableTime",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "tokenId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "day",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "move",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct DailyMove",
                "name": "moveInfo",
                "type": "tuple"
            },
            {
                "internalType": "enum PlayerStatus",
                "name": "status",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "rewardContract",
        "outputs": [
            {
                "internalType": "contract Reward",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "attacker_playerid",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "victim_playerid",
                "type": "uint256"
            }
        ],
        "name": "rob",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "nftContract",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "isAllowed",
                "type": "bool"
            }
        ],
        "name": "setAllowedNFTContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "enum Game.ConfigKey",
                "name": "key",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "setConfigUint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "setDailyMovesForLevel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            }
        ],
        "name": "setDotsRequiredForLevel",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setMazeContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_operator",
                "type": "address"
            },
            {
                "internalType": "bool",
                "name": "allowed",
                "type": "bool"
            }
        ],
        "name": "setOperator",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_contract",
                "type": "address"
            }
        ],
        "name": "setRewardContract",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "toggleGame",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]

export default gameABI;