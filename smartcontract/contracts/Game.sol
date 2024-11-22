// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
//TODO: shield integration? with gameequip
//TODO: implement rob done, need testing!!
//TODO test function to edit those game setting variables
//REWARD RELATED FUNCTION CALL?
//SET array varriables?
//max contract size ..
//TODO:END GAME can be called externally
//TODO: GAME PAUSE
//TODO Eyes related manhattan distance
//TODO Player can add/remove alliances
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./Helper.sol";
import "./Reward.sol"; // Import the ZSP contract
import "./Maze.sol";
enum PlayerStatus { Inactive, Active, LockedIn , Forfeit }
enum Ending { Not_Ended ,Ending1_CoGovernance ,Ending2_Oligarchy , Ending3_Monoploy}
struct DailyMove{
    uint256 day;   // Day number based on block.timestamp / 1 days
    uint256 move;  //move on that day
}
struct PlayerPosition{
    uint8 x;
    uint8 y;
    uint8 maze;
}
struct Player {
        PlayerPosition playerposition;
        uint256 dots;
        uint256 level;
        uint256 nextMoveTime;
        uint256 nextSwitchMazeTime;
        uint256 shieldExpireTime;
        uint256 protectionExpireTime;
        address nftContract;
        uint256 tokenId;
        DailyMove moveInfo;
        PlayerStatus status;
}

event AllowedNFTContract(address indexed nftContract, bool isAllowed);
event NFTRegistered(address indexed nftContract, uint256 indexed tokenId, address indexed owner,uint256 playerid);
event PlayerStatusChanged(PlayerStatus status,uint256 playerid);
event PlayerMoved(uint256 maze,uint256 x,uint256 y,uint256 playerid);
event DotChanged(int256 dotdelta,uint256 indexed playerid);
event PlayerAttacked(uint256 attackerplayerid,uint256 victimplayerid,uint256 dotdelta);
event PlayerRobbed(uint256 attackerplayerid,uint256 victimplayerid);
event DotLocked (uint256 dot,uint256 level);
event ShieldTimeChanged(uint256 timestamp,uint256 indexed playerid);
event ProtectionTimeChanged(uint256 timestamp,uint256 indexed playerid);
event GameEnded(uint256 ending);
contract Game is Ownable {
    // Mapping to store approved NFT contracts
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
    mapping(address => bool) public allowedNFTContracts;
    mapping(address => bool) public allowedOperators;
    Reward public rewardContract;
    Maze public mazeContract;

    // Mapping to track registered NFTs (contract address => token ID => registered id)
    mapping(address => mapping(uint256 => uint256)) public nft_to_playerid;
    uint256 public next_player_id=1;
    mapping(uint256 => Player) public players;
    uint256 public level3DotsLocked;
    uint256 public level4DotsLocked;
    uint256 public endingThreshold = 5001; 
    Ending public GAME_ENDED = Ending.Not_Ended; // 0 = not ended

    // uint256 public FIRST_ENTRANCE_MOVE_INTERVAL=60; //freeze for 1 minutes when you first enter the game or switch maze
    // uint256 public MOVE_INTERVAL=10;
    // uint256 public PROTECTION_INTERVAL=43200; //12 hours
    // uint256 public MAX_SHIELD_INTERVAL=86400;//24 hours;
    // uint256 public MAZE_SWITCH_INTERVAL=604800; // 7 days
    // uint256 public MAZE_SWITCH_PENALTY= 0.001 ether;
    // uint256 public SHIELD_PRICE=0.00005 ether; //16 cents per hour
    // uint256 public MIN_LOCK_IN_LV=3;
    // uint256 public MIN_SHIELD_LV=3;
    // uint256 public EAT_PERCENTAGE=10;
    // uint256 public ROB_PERCENTAGE=10;
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

    uint256[] public DOTS_REQUIRED_FOR_LEVELS = [0, 0, 40, 200, 500, 5001];
    uint256[] public DAILY_MOVES_FOR_LEVELS = [0,10,15,20,25,30];
    

    function setDotsRequiredForLevel(uint256 level, uint256 value) external onlyOwner{
        DOTS_REQUIRED_FOR_LEVELS[level] = value;
    }
    function setDailyMovesForLevel(uint256 level, uint256 value) external onlyOwner{
        DAILY_MOVES_FOR_LEVELS[level] = value;
    }

    modifier ownsNFT(uint256 playerid) {
        IERC721 nft = IERC721(players[playerid].nftContract);
        uint256 tokenId=players[playerid].tokenId;
        require(nft.ownerOf(tokenId) == msg.sender, "Not owner");
        _;

    }
    function setRewardContract(address _contract) external onlyOwner {
        rewardContract =Reward(_contract);
    }
    function setMazeContract(address _contract) external onlyOwner {
        mazeContract =Maze(_contract);
    }
    modifier onlyAllowedOperator() {
        require(allowedOperators[msg.sender] || msg.sender == owner(), "Not allowed");
        _;
    }

    // NFT allowed to join our game
    function setAllowedNFTContract(address nftContract, bool isAllowed) public onlyOwner {
        allowedNFTContracts[nftContract] = isAllowed;
        emit AllowedNFTContract(nftContract, isAllowed);
    }
    
    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }
    function setConfigUint(ConfigKey key, uint256 value) public onlyOwner {
        config[key] = value;
    }
    function getConfigUint(ConfigKey key) public view returns (uint256) {
        return config[key];
    }

    // Register an NFT for the game (for the first time, don't call move player to because it checks certain conditions)
    function enterGame(address nftContract, uint256 tokenId,uint8 maze, uint8 x, uint8 y) external {
        IERC721 nft = IERC721(nftContract);
        require(GAME_ENDED==Ending.Not_Ended,"Game Ended");
        require(allowedNFTContracts[nftContract], "Not Invited");
        require(nft.ownerOf(tokenId) == msg.sender, "Not Owner");
        require(nft_to_playerid[nftContract][tokenId]==0, "Registered");
        require(mazeContract.hasplayer(maze,x,y)==0); //You can move direactly on top another person

        // Mark the NFT as registered and assign an id
        nft_to_playerid[nftContract][tokenId] = next_player_id;
        players[next_player_id]=Player({
            playerposition:PlayerPosition({x:x,y:y,maze:maze}),
            dots:0,
            level:1,
            nextMoveTime: block.timestamp + config[ConfigKey.FIRST_ENTRANCE_MOVE_INTERVAL], // Initialize next move time to the current time
            nextSwitchMazeTime:block.timestamp + config[ConfigKey.MAZE_SWITCH_INTERVAL],
            shieldExpireTime: 0,
            protectionExpireTime:0,
            nftContract:nftContract,
            tokenId:tokenId,
            moveInfo:DailyMove(0,0),
            status:PlayerStatus.Active
        });

        emit NFTRegistered(nftContract, tokenId, msg.sender,next_player_id);
        emit PlayerStatusChanged(PlayerStatus.Active,next_player_id);
        _movePlayerHelper(maze,x,y,next_player_id,true);
        emit PlayerMoved(maze,x,y,next_player_id);
        _incrementMoveCount(next_player_id); // don't put it inside moveplayer in maze, because there might be passive moves
        //Don't call movePlayerTo since you're entering the first time it checkes for adjacency etc
        next_player_id+=1;
    }

    function movePlayerTo(uint256 playerid,uint8 maze, uint8 x, uint8 y) payable external ownsNFT(playerid){
        require(GAME_ENDED==Ending.Not_Ended,"Game Ended");
        require(players[playerid].nextMoveTime < block.timestamp,"Please wait until nextMoveTime");
        uint8 currx = players[playerid].playerposition.x;
        uint8 curry = players[playerid].playerposition.y;
        if(players[playerid].playerposition.maze != maze){ //are you switching to a different maze
            //checking penality and reset relevant timestamps
            require(mazeContract.hasplayer(maze,x,y)==0,"You can travel to a occupied grid when you switch maze");
            require(block.timestamp>players[playerid].nextSwitchMazeTime || msg.value >=config[ConfigKey.MAZE_SWITCH_PENALTY] , "Need to pay the penalty if want to switch maze before time is up");
            players[playerid].nextMoveTime = block.timestamp + config[ConfigKey.FIRST_ENTRANCE_MOVE_INTERVAL];
            players[playerid].nextSwitchMazeTime = block.timestamp + config[ConfigKey.MAZE_SWITCH_INTERVAL];
            _movePlayerHelper(maze,x,y,playerid,true);

        }
        else{
            //require movement<max stride
            //This can be checked in maze contract
            //require(Helper.isAdjacent(currx,curry,x,y),"distance greater than max stride");
            if(mazeContract.hasplayer(maze,x,y)==0){
                 _movePlayerHelper(maze,x,y,playerid,false);
            }
            else{
                uint256 otherplayerid=mazeContract.hasplayer(maze,x,y);
                uint256 dotdelta=(players[otherplayerid].dots* config[ConfigKey.EAT_PERCENTAGE] + 99) / 100;

                require(players[playerid].level>=players[otherplayerid].level,"Can't attack higher ranked");
                require(block.timestamp>players[otherplayerid].shieldExpireTime,"Shielded");
                require(block.timestamp>players[otherplayerid].protectionExpireTime,"Protected");
                //check level
                //check shield
                //eat pac
                //swap positions and dot change for both
                players[otherplayerid].protectionExpireTime=block.timestamp+config[ConfigKey.PROTECTION_INTERVAL]; //victim is now immune for the next protection interval
                 _changeDot(playerid,int256(dotdelta));
                 _changeDot(otherplayerid,-int256(dotdelta));
                _movePlayerHelper(maze,x,y,playerid,false);
                _movePlayerHelper(maze,currx,curry,otherplayerid,true); //the other player is moved passively, stride will not be checked

                emit PlayerAttacked(playerid,otherplayerid,dotdelta);
            }
            players[playerid].nextMoveTime = block.timestamp + config[ConfigKey.MOVE_INTERVAL];

        }
        
        //if switch maze
            //check maze switch countdown
        //else
            //check adjacency and border
            //if eat pac
                //swap position, give 10% of dots, round up!
            //else
                //just move 
        players[playerid].protectionExpireTime=0; //your protection immediately expires once you move actively, don't put this inside helper because of passive moving:)
        _incrementMoveCount(playerid); 
    }

    function _movePlayerHelper(uint8 maze, uint8 x, uint8 y,uint256 playerid,bool ignorestride) internal{
        
        uint256 dot_add = mazeContract._movePlayerInMaze(maze,x,y,players[playerid].playerposition.maze,players[playerid].playerposition.x,players[playerid].playerposition.y,playerid,ignorestride);
        players[playerid].playerposition.x=x;
        players[playerid].playerposition.y=y;
        players[playerid].playerposition.maze=maze;
        _changeDot(playerid,int256(dot_add));
        emit PlayerMoved(maze,x,y,playerid); 

    }


    function rob(uint256 attacker_playerid, uint256 victim_playerid) external ownsNFT(attacker_playerid) {
        require(GAME_ENDED == Ending.Not_Ended, "Game Ended");

        // Retrieve players' positions
        Player storage attacker = players[attacker_playerid];
        Player storage victim = players[victim_playerid];

        // Helper variables for victim's position
        uint8 x_victim = victim.playerposition.x;
        uint8 y_victim = victim.playerposition.y;
        uint8 maze_victim = victim.playerposition.maze;

        // Helper variables for attacker's position
        uint8 x_player = attacker.playerposition.x;
        uint8 y_player = attacker.playerposition.y;
        uint8 maze_player = victim.playerposition.maze;

        // Check if the victim is surrounded
        // Ensure the attacker and victim are adjacent
        // Check if the victim's shield and protectionhas expired
        require(victim.dots>=4);
        require(mazeContract._isSurrounded(x_victim, y_victim, maze_victim), "Not Surrounded");
        require(maze_victim==maze_player && Helper.isAdjacent(x_victim, y_victim, x_player, y_player), "No");
        require(block.timestamp > victim.shieldExpireTime && block.timestamp > victim.protectionExpireTime, "Can't Attack");
        

        // Update the victim's protection timestamp
        victim.protectionExpireTime = block.timestamp + config[ConfigKey.PROTECTION_INTERVAL];
        uint256 dotdelta=(victim.dots* config[ConfigKey.EAT_PERCENTAGE] + 99) / 100;
        
        if(mazeContract.hasplayer(maze_victim,x_victim,y_victim - 1)>0){
            _changeDot(victim_playerid, -int256(dotdelta));
            _changeDot(mazeContract.hasplayer(maze_victim,x_victim,y_victim - 1), int256(dotdelta));
        }
        if(mazeContract.hasplayer(maze_victim,x_victim,y_victim + 1)>0){
            _changeDot(victim_playerid, -int256(dotdelta));
            _changeDot(mazeContract.hasplayer(maze_victim,x_victim,y_victim + 1), int256(dotdelta));
        }
        if(mazeContract.hasplayer(maze_victim,x_victim-1,y_victim)>0){
            _changeDot(victim_playerid, -int256(dotdelta));
            _changeDot(mazeContract.hasplayer(maze_victim,x_victim-1,y_victim), int256(dotdelta));
        }
        if(mazeContract.hasplayer(maze_victim,x_victim+1,y_victim)>0){
            _changeDot(victim_playerid, -int256(dotdelta));
            _changeDot(mazeContract.hasplayer(maze_victim,x_victim+1,y_victim), int256(dotdelta));
        }
        emit PlayerRobbed(attacker_playerid,victim_playerid);
        // robAdjacentPlayers(x_victim, y_victim, maze_victim, dotdelta, victim_playerid);
        
            //TODO
            //check if attacking player is adjacent to victim and in same maze
            //check if surrounded (get top left right left person, and cells)
            //check shield and protection
            //change protection time
            //change dot (helper function)
            //remeber to check for obstacle that also counts
            //remember to  emit dot change for all relevant playeer just call helper function
            // no need to swap playerposition
        //emit relevant rob event
    }




    // Helper function to check if a player is surrounded
   

    function _addShieldTime(uint256 playerid, uint256 shieldsecond) public onlyAllowedOperator{
        require(GAME_ENDED==Ending.Not_Ended,"Game Ended");
        require(players[playerid].shieldExpireTime  + shieldsecond<= block.timestamp+ config[ConfigKey.MAX_SHIELD_INTERVAL], "You can only be shielded for a max period of time");
        require(shieldsecond<=config[ConfigKey.MAX_SHIELD_INTERVAL],"No");
        require(players[playerid].level>=config[ConfigKey.MIN_SHIELD_LV]);
        if(players[playerid].shieldExpireTime>block.timestamp){
            players[playerid].shieldExpireTime+=shieldsecond;
        }
        else{
            players[playerid].shieldExpireTime=block.timestamp+shieldsecond;
        }

    }
    function buyShield(uint256 playerid, uint256 shieldhours) external payable ownsNFT(playerid){
        require(msg.value>=config[ConfigKey.SHIELD_PRICE]*shieldhours, "Not enough ETH");
        _addShieldTime(playerid,shieldhours*3600);
    }

    function _incrementMoveCount(uint256 playerid) internal{
        uint256 currentday=block.timestamp/86400;
        if(currentday==players[playerid].moveInfo.day){
            uint256 maxmoveperday=DAILY_MOVES_FOR_LEVELS[players[playerid].level];
            require(players[playerid].moveInfo.move<maxmoveperday,"max move exceeded for today");
            players[playerid].moveInfo.move+=1;
        }
        else{
            players[playerid].moveInfo.day=currentday;
            players[playerid].moveInfo.move=1;
        }
    }
    function _removePlayerFromBoard(uint256 playerid)internal{
 
        //Set the maze to empty; TOCHECK
        mazeContract.hasplayer(players[playerid].playerposition.maze,players[playerid].playerposition.x,players[playerid].playerposition.y);
        uint8 largenumber=255;
        players[playerid].playerposition.x=largenumber;
        players[playerid].playerposition.y=largenumber;
        players[playerid].playerposition.maze=largenumber;
        emit PlayerMoved(largenumber,largenumber,largenumber,playerid);
    }
    function _checkLevelChange(uint256 playerid) internal{
        uint256 dots=players[playerid].dots;
        if(dots>=DOTS_REQUIRED_FOR_LEVELS[5]){
            players[playerid].level=5;
            GAME_ENDED = Ending.Ending3_Monoploy;
            rewardContract.GiveReward(_getPlayerIdAddress(playerid),5);
            emit GameEnded(3);
        }
        else if (dots>=DOTS_REQUIRED_FOR_LEVELS[4]){
            players[playerid].level=4;
        }
        else if (dots>=DOTS_REQUIRED_FOR_LEVELS[3]){
            players[playerid].level=3;
        }
        else if (dots>=DOTS_REQUIRED_FOR_LEVELS[2]){
            players[playerid].level=2;
        }
        else{
            players[playerid].level=1;
        }
    }
    function _checkGameEnded() internal{
        if(level3DotsLocked>endingThreshold){
            GAME_ENDED = Ending.Ending1_CoGovernance;
            emit GameEnded(1);
        }
        if(level4DotsLocked>endingThreshold){
            GAME_ENDED = Ending.Ending2_Oligarchy;
            emit GameEnded(2);
            //register remaining top lv 4 player to 1/1 whitelist manually
        }
    }
    function _getPlayerIdAddress(uint256 playerid) internal view returns(address){
        IERC721 nft = IERC721(players[playerid].nftContract);
        uint256 tokenId=players[playerid].tokenId;
        return nft.ownerOf(tokenId);
    }

    function _changeDot(uint256 playerid,int256 dotdelta) internal{
        uint256 dots=players[playerid].dots;
        require(dotdelta >= 0 || dots>= uint256(-dotdelta), "Underflow error");
        require(dotdelta <= 0 || uint256(dotdelta) <= type(uint256).max - dots, "Overflow error");
        players[playerid].dots = uint256(int256(dots) + dotdelta);
        _checkLevelChange(playerid);
        emit DotChanged(dotdelta, playerid);
    }

    function lockIn(uint256 playerid) external ownsNFT(playerid){
        require(GAME_ENDED==Ending.Not_Ended,"Game Ended");
        require(players[playerid].status==PlayerStatus.Active, "Need to be an active player");
        require(players[playerid].level>=config[ConfigKey.MIN_LOCK_IN_LV], "Min lock-in level not reached");
        
        players[playerid].status=PlayerStatus.LockedIn;
        uint256 dots=players[playerid].dots;
        uint256 level=players[playerid].level;
        if(level==3){
            level3DotsLocked+=dots;
            rewardContract.GiveReward(_getPlayerIdAddress(playerid),3);
        }
        if (level==4){
            level4DotsLocked+=dots;
            rewardContract.GiveReward(_getPlayerIdAddress(playerid),4);
        }
        
        emit PlayerStatusChanged(PlayerStatus.LockedIn,playerid);
        emit DotLocked(dots,level);
        _removePlayerFromBoard(playerid);
        _checkGameEnded();
    }

    //please be careful, playerid is NOT tokenid
    function forfeit(uint256 playerid,uint256 destination_playerid) external ownsNFT(playerid){
        require(GAME_ENDED==Ending.Not_Ended,"Game Ended");
        require(playerid!=destination_playerid);
        require(players[playerid].status==PlayerStatus.Active,"Not Active");
        require(players[destination_playerid].status==PlayerStatus.Active,"Not Active");
        //forfeit all the dots and exit the game
        uint256 dots=players[playerid].dots;
        players[playerid].status=PlayerStatus.Forfeit;
        _changeDot(playerid,-int256(dots));
        _changeDot(destination_playerid,int256(dots));
        _removePlayerFromBoard(playerid);
        emit PlayerStatusChanged(PlayerStatus.Forfeit,playerid);
        
    }


    function checkPlayerId(address nftContract, uint256 tokenId) external view returns (uint256) {
        return nft_to_playerid[nftContract][tokenId];
    }


    function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    // function withdraw_backup() external onlyOwner {
    //     uint256 contractBalance = address(this).balance;
    //     require(contractBalance > 0, "No funds available for withdrawal");
    //     (bool success, ) = payable(msg.sender).call{value: contractBalance}("");
    //     require(success, "Withdrawal failed");
    // }

}
