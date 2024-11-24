pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

// interface GameConfig {
//       enum ConfigKey {
//         FIRST_ENTRANCE_MOVE_INTERVAL,
//         MOVE_INTERVAL,
//         PROTECTION_INTERVAL,
//         MAX_SHIELD_INTERVAL,
//         MAZE_SWITCH_INTERVAL,
//         MAZE_SWITCH_PENALTY,
//         SHIELD_PRICE,
//         MIN_LOCK_IN_LV,
//         MIN_SHIELD_LV,
//         EAT_PERCENTAGE,
//         ROB_PERCENTAGE
//     }
//     function getConfig(ConfigKey key) external view returns (uint256);
//     function setConfig(ConfigKey key, uint256 value) external;
//     function getDotsRequiredForLevels(uint256 level) external view returns (uint256);
//     function getDailyMovesForLevel(uint256 level) external view returns (uint256);
//     function getMazeUnlockDotsRequired(uint256 level) external view returns (uint256);
// }


contract GameConfig  is Ownable{
    // Declare arrays as public constant variables (only if they are immutable)
    constructor() Ownable(msg.sender) {
        config[ConfigKey.FIRST_ENTRANCE_MOVE_INTERVAL] = 60;
        config[ConfigKey.MOVE_INTERVAL] = 10;
        config[ConfigKey.PROTECTION_INTERVAL] = 43200;
        config[ConfigKey.MAX_SHIELD_INTERVAL] = 86400;
        config[ConfigKey.MAZE_SWITCH_INTERVAL] = 604800;
        config[ConfigKey.MAZE_SWITCH_PENALTY] = 0.001 ether;
        config[ConfigKey.SHIELD_PRICE] = 0.00005 ether;
        config[ConfigKey.MIN_LOCK_IN_LV] = 3;
        config[ConfigKey.MIN_SHIELD_LV] = 3;
        config[ConfigKey.EAT_PERCENTAGE] = 10;
        config[ConfigKey.ROB_PERCENTAGE] = 10;
    }

    enum ConfigKey {
        FIRST_ENTRANCE_MOVE_INTERVAL,
        MOVE_INTERVAL,
        PROTECTION_INTERVAL,
        MAX_SHIELD_INTERVAL,
        MAZE_SWITCH_INTERVAL,
        MAZE_SWITCH_PENALTY,
        SHIELD_PRICE,
        MIN_LOCK_IN_LV,
        MIN_SHIELD_LV,
        EAT_PERCENTAGE,
        ROB_PERCENTAGE
    }

    mapping(ConfigKey => uint256) private config;
    uint256[] private DOTS_REQUIRED_FOR_LEVELS = [0, 0, 40, 200, 500, 5001];
    uint256[] private DAILY_MOVES_FOR_LEVELS = [0, 10, 15, 20, 25, 30];
    uint256[] private MAZE_UNLOCK_DOTS_REQUIRED = [0, 0, 0, 0, 0, 4000, 5000, 6000, 7000, 8000];
    
    function setConfig(ConfigKey key, uint256 value) public onlyOwner {
        config[key] = value;
    }
    function getConfig(ConfigKey key) public view returns (uint256) {
        return config[key];
    }


    // Getter functions (optional, Solidity automatically provides getters for public arrays)
    function getDotsRequiredForLevels(uint256 level) public view returns (uint256) {
        require(level < DOTS_REQUIRED_FOR_LEVELS.length, "Invalid level");
        return DOTS_REQUIRED_FOR_LEVELS[level];
    }

    function getDailyMovesForLevel(uint256 level) public view returns (uint256) {
        require(level < DAILY_MOVES_FOR_LEVELS.length, "Invalid level");
        return DAILY_MOVES_FOR_LEVELS[level];
    }

    function getMazeUnlockDotsRequired(uint256 level) public view returns (uint256) {
        require(level < MAZE_UNLOCK_DOTS_REQUIRED.length, "Invalid level");
        return MAZE_UNLOCK_DOTS_REQUIRED[level];
    }

    // Setters (optional, if you need to change the arrays after deployment)
    function setDotsRequiredForLevel(uint256 level, uint256 value) external {
        require(level < DOTS_REQUIRED_FOR_LEVELS.length, "Invalid level");
        DOTS_REQUIRED_FOR_LEVELS[level] = value;
    }

    function setDailyMovesForLevel(uint256 level, uint256 value) external {
        require(level < DAILY_MOVES_FOR_LEVELS.length, "Invalid level");
        DAILY_MOVES_FOR_LEVELS[level] = value;
    }

    function setMazeUnlockDotsRequired(uint256 level, uint256 value) external {
        require(level < MAZE_UNLOCK_DOTS_REQUIRED.length, "Invalid level");
        MAZE_UNLOCK_DOTS_REQUIRED[level] = value;
    }
}
