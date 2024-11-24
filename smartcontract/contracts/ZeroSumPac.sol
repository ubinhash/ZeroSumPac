// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Maze.sol";
contract ZeroSumPac is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public approvedMintContracts;
    //TODO remember to check total supply before minting
    //TODO ways to add special trait in future/ eg default map to normal, if it has a speicial tag, maps to animated

    // Pass msg.sender to Ownable's constructor
    constructor() ERC721("ZSP", "ZSP") Ownable(msg.sender) {}
    uint256 maxSupply = 666; // TBD
    uint256 mintPrice = 0.015 ether; //TBD
    Maze public mazeContract;

    function setMazeContract(address _contract) external onlyOwner {
        mazeContract =Maze(_contract);
    }

    modifier hasStock(uint256 amount) {
         require(nextTokenId+amount<maxSupply,"Out of Stock");
        _;
    }


 
    function _batchMint(address to, uint256 amount) internal {
        for (uint256 i = 0; i < amount; i++) {
            _safeMint(to, nextTokenId);
            nextTokenId++;
        }
        mazeContract.updateMintCount(nextTokenId);
    }

    function ownerMint(address to, uint256 amount) external onlyOwner hasStock(amount){

        _batchMint(to,amount);
    }

    function whitelistMint() external{
        //TBD
    }

    function publicMint(address to, uint256 amount) external payable hasStock(amount){
        require(msg.value*amount>=mintPrice,"Insufficient Fund");
        _batchMint(msg.sender,amount);
        
    }

    function setApprovedMinter(address _contract,bool allows) external onlyOwner {
        approvedMintContracts[_contract] = allows;
    }

    function mintFromApprovedContract(address to,uint256 amount) external hasStock(amount){
        require(approvedMintContracts[msg.sender], "Not an approved minter");
        _batchMint(to, amount);

    }

      function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
}
