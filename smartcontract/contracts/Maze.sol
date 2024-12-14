// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "./GameEquip.sol";
import "./Helper.sol";
import "./ZeroSumPac.sol";
// Intended to be helper contract for Game, User don't interact with it

contract Maze is Ownable{
    uint8 public constant GRID_SIZE = 20;
    uint8 public constant TOTAL_MAZES = 10;
    enum CellState { HasDot, Empty, HasObstacle }
    mapping(uint8 => mapping(uint8 => mapping(uint8 => CellState))) public mazes;
    mapping(uint8 => mapping(uint8 => mapping(uint8 => uint256))) public hasplayer; //maps cell to playerid
    mapping(uint8=>bool) public maze_unlocked;
    mapping(uint8=>uint256) public maze_dots_consumed;
    uint256 public total_dots_consumed=0;
    uint256 public total_dots_in_mazes=3780;
    mapping(address => bool) public allowedOperators;
    uint256[] public MAZE_UNLOCK_DOTS_REQUIRED = [0,0,0,0,0,1500,2000,2900,3400];
    uint256[] public MAZE_UNLOCK_MINT_REQUIRED = [0,100,200,300,555,0,0,0,0];
    event MazeStatusChanged(uint8 maze,bool unlocked);
    GameEquip public gameEquipContract;



    constructor() Ownable(msg.sender) {
        for (uint8 mazeId = 0; mazeId < TOTAL_MAZES; mazeId++) {
            _setObstaclesForMaze(mazeId);
        }
        //TODO: ADD GAME CONTRACT TO ALLOWED OPERATOR
        //TODO ADD GAME EQUIP CONTRACT
    }
     modifier onlyAllowedOperator() {
        
        require(allowedOperators[msg.sender] || msg.sender == owner(), "Not allowed");
        _;
    }
    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }
    function setGameEquipContract(address _contractAddress) external onlyOwner{
        gameEquipContract = GameEquip(_contractAddress);
    }

    function setMazeUnlockDotsRequired(uint256 level, uint256 value) external onlyOwner{
        MAZE_UNLOCK_DOTS_REQUIRED[level] = value;
    }
     function setMazeUnlockMintsRequired(uint256 level, uint256 value) external onlyOwner{
        MAZE_UNLOCK_MINT_REQUIRED[level] = value;
    }


    function unlockMaze(uint8 maze,bool unlocked) public onlyAllowedOperator{
        maze_unlocked[maze]=unlocked;
        emit MazeStatusChanged(maze,unlocked);
    }
    
    function updateMintCount(uint256 mintCount) public onlyAllowedOperator{
          for(uint8 i=0;i<5;i++){
                if(!maze_unlocked[i] && mintCount>= MAZE_UNLOCK_MINT_REQUIRED[i]){
                    unlockMaze(i,true);
                }
            }
    }

    function _setObstaclesForMaze(uint8 mazeId)public onlyAllowedOperator {
        //cross shape
        if(mazeId % 2 == 0){
            for (uint8 i = 5;i < 15; i++) {
                mazes[mazeId][i][i] = CellState.HasObstacle;
                mazes[mazeId][19-i][i] = CellState.HasObstacle;
            }
            mazes[mazeId][9][9] = CellState.HasDot;
            mazes[mazeId][10][10] = CellState.HasDot;
            mazes[mazeId][10][9] = CellState.HasDot;
            mazes[mazeId][9][10] = CellState.HasDot;

            mazes[mazeId][8][9] = CellState.HasObstacle;
            mazes[mazeId][8][10] = CellState.HasObstacle;
            mazes[mazeId][11][9] = CellState.HasObstacle;
            mazes[mazeId][11][10] = CellState.HasObstacle;
        }

         //rect shape
        if(mazeId % 2 == 1){
            mazes[mazeId][5][5] = CellState.HasObstacle;
            mazes[mazeId][5][6] = CellState.HasObstacle;
            mazes[mazeId][5][7] = CellState.HasObstacle;
            mazes[mazeId][6][5] = CellState.HasObstacle;
            mazes[mazeId][7][5] = CellState.HasObstacle;

            mazes[mazeId][14][14] = CellState.HasObstacle;
            mazes[mazeId][14][13] = CellState.HasObstacle;
            mazes[mazeId][14][12] = CellState.HasObstacle;
            mazes[mazeId][13][14] = CellState.HasObstacle;
            mazes[mazeId][12][14] = CellState.HasObstacle;

            mazes[mazeId][5][14] = CellState.HasObstacle;
            mazes[mazeId][5][13] = CellState.HasObstacle;
            mazes[mazeId][5][12] = CellState.HasObstacle;
            mazes[mazeId][6][14] = CellState.HasObstacle;
            mazes[mazeId][7][14] = CellState.HasObstacle;

            mazes[mazeId][14][5] = CellState.HasObstacle;
            mazes[mazeId][13][5] = CellState.HasObstacle;
            mazes[mazeId][12][5] = CellState.HasObstacle;
            mazes[mazeId][14][6] = CellState.HasObstacle;
            mazes[mazeId][14][7] = CellState.HasObstacle;

        }

        // //diagnol shape
        // if(mazeId % 3 == 2){
        //     for (uint8 i = 2;i < 18; i++) {
        //         mazes[mazeId][i][i] = CellState.HasObstacle;
        //     }
        // }

    }
    function setTotalDot(uint256 dots) external onlyOwner{
            total_dots_in_mazes=dots;
    }

    function _isMazeUnlocked(uint8 maze,uint256 playerid) public view returns(bool){
        if(maze == TOTAL_MAZES-1){
            return gameEquipContract.playerEquippedKeys(playerid);
        }
        else{
            return maze_unlocked[maze];
        }

    }
    function _getMaxStride(uint256 playerid) public view returns(uint8){
        if(gameEquipContract.playerEquippedEyes(playerid)){
            return 2;
        }
        else{
            return 1;
        }
    }
    function setplayer(uint8 maze, uint8 x, uint8 y ,uint256 playerid) external onlyAllowedOperator {
        hasplayer[maze][x][y]=playerid;
    }
    function _movePlayerInMaze(uint8 maze, uint8 x, uint8 y,uint8 oldmaze,uint8 oldx,uint8 oldy,uint256 playerid,bool ignorestride) external onlyAllowedOperator returns(uint256){
        require(mazes[maze][x][y]!=CellState.HasObstacle,"Obstacle");
        require(x>=0 && x <GRID_SIZE && y>=0 && y<GRID_SIZE,"Boundary");
        require(maze< TOTAL_MAZES,"invalid maze");
        require(_isMazeUnlocked(maze,playerid),"maze not unlocked");
        //TODO PLEASE IGNORE THIS WHEN YOU FIRST ENTER
        //TODO BUG RELATED TO SWITCHING MAZE

        require(ignorestride || (Helper.distance(x,y,oldx,oldy)<=_getMaxStride(playerid) && Helper.distance(x,y,oldx,oldy)>0),"distance is zero or greater than max stride");

        // Clear old position if it's not a swap, if it's a swap the old position will be occupied by another player
        if(hasplayer[oldmaze][oldx][oldy]==playerid){
            hasplayer[oldmaze][oldx][oldy]=0;
        }
        hasplayer[maze][x][y]=playerid;

        //TODO SET IN OTHER CONTRACTS ABOUT PLAYER INFORMATION
        // players[playerid].playerposition.x=x;
        // players[playerid].playerposition.y=y;
        // players[playerid].playerposition.maze=maze;
        
        if(mazes[maze][x][y]==CellState.HasDot){
            mazes[maze][x][y]=CellState.Empty;
            maze_dots_consumed[maze]+=1;
            total_dots_consumed+=1;
            for(uint8 i=5;i<TOTAL_MAZES-1;i++){
                if(!maze_unlocked[i] && total_dots_consumed>=MAZE_UNLOCK_DOTS_REQUIRED[i]){
                    unlockMaze(i,true);
                }
            }
            return 1;
        }
        return 0;
    }
     function _isSurrounded(uint8 x_victim, uint8 y_victim, uint8 maze_victim) public view returns (bool) {
        bool top = (y_victim == 0) || (hasplayer[maze_victim][x_victim][y_victim - 1] > 0) || mazes[maze_victim][x_victim][y_victim - 1] == CellState.HasObstacle;
        bool bottom = (y_victim == GRID_SIZE - 1) || (hasplayer[maze_victim][x_victim][y_victim + 1] > 0) || mazes[maze_victim][x_victim][y_victim + 1] == CellState.HasObstacle;
        bool left = (x_victim == 0) || (hasplayer[maze_victim][x_victim - 1][y_victim] > 0) || mazes[maze_victim][x_victim - 1][y_victim] == CellState.HasObstacle;
        bool right = (x_victim == GRID_SIZE - 1) || (hasplayer[maze_victim][x_victim + 1][y_victim] > 0) || mazes[maze_victim][x_victim + 1][y_victim] == CellState.HasObstacle;

        return top && bottom && left && right;
    }

}
