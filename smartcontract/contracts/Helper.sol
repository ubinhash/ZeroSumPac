// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;



library Helper {

    function distance(uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal pure returns(uint8){
        uint8 dx = x1 > x2 ? x1 - x2 : x2 - x1;
        uint8 dy = y1 > y2 ? y1 - y2 : y2 - y1;
        return dx+dy;
    }
    function isAdjacent(uint8 x1, uint8 y1, uint8 x2, uint8 y2) internal pure returns (bool) {
        return distance(x1, y1, x2, y2)==1;
    }

}


