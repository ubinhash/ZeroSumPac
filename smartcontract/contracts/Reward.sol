// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./ZeroSumPac.sol"; // Import the ZSP contract

contract Reward is  IERC721Receiver,Ownable {
    ZeroSumPac public zspContract; // Reference to the ZSP contract using ERC721Enumerable
    address public special_claim;
    mapping(address => uint256) public oneofone_whitelist;
    mapping(address => uint256) public oneofone_claimed;
    uint256 public whitelist_count = 0;
    uint256 public constant MAX_WHITELIST = 10;
    uint256 public specialTokenId=0;


    mapping(address => bool) public allowedOperators;
    

    constructor() Ownable(msg.sender) {}

    modifier onlyAllowedOperator() {
        require(allowedOperators[msg.sender], "Not an allowed operator");
        _;
    }

    // Function to set the ZSP contract address (only callable by the owner)
    function setZSPContract(address _zspContract) external onlyOwner {
        zspContract =ZeroSumPac(_zspContract);
    }

    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }
    function setSpecialTokenId(uint256 tokenId) external onlyOwner{
        specialTokenId=tokenId;
    }
     function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external override returns (bytes4) {
        // Handle the receipt of the token (store or log)
        return this.onERC721Received.selector; // Return the correct selector
    }


    // Function to mint and store NFTs in a single call
    function mintAndStoreNFT(uint256 amount) external onlyOwner {
        require(amount>0,"amount must be greater than zero");
        // Call mintFromApprovedContract to mint the NFTs directly to the contract
        ZeroSumPac(address(zspContract)).mintFromApprovedContract(address(this), amount);
    }

    // Function for the contract owner to claim a specific NFT
    function ClaimNFTByOwner (uint256 tokenId) external onlyOwner {
        require(zspContract.ownerOf(tokenId) == address(this), "NFT not owned by contract");
        zspContract.safeTransferFrom(address(this), owner(), tokenId);
    }

    function ClaimNFTOneOne  (uint256 tokenId) external{
        require(tokenId!=specialTokenId,"Token is not 1/1");
        require(zspContract.ownerOf(tokenId) == address(this), "NFT not owned by contract");
        require(oneofone_whitelist[msg.sender] - oneofone_claimed[msg.sender]>0,"no whitelist left");
        zspContract.safeTransferFrom(address(this), msg.sender, tokenId);

    }

    function claimNFTSpecial () external{
        require(zspContract.ownerOf(specialTokenId) == address(this), "NFT not owned by contract");
        require(special_claim == msg.sender);
        zspContract.safeTransferFrom(address(this), msg.sender, specialTokenId);
    }


    // Function to get a list of all NFTs owned by the contract that can be claimed
    function getClaimableNFTs() external view returns (uint256[] memory) {
        uint256 total = zspContract.balanceOf(address(this)); 
        uint256[] memory claimableNFTs = new uint256[](total);

        for (uint256 i = 0; i < total; i++) {
            claimableNFTs[i] = zspContract.tokenOfOwnerByIndex(address(this), i);
        }

        return claimableNFTs;
    }

    function setSpecialClaim(address _address) internal{
        special_claim=_address;
    }
     function addToWhitelist(address _address,uint256 _num) internal {
        require(whitelist_count + _num <= MAX_WHITELIST, "Whitelist is full");
        
        oneofone_whitelist[_address] += _num;
        whitelist_count+=_num;
    }
    //megre this three into one function to save contract size?


     function GiveReward(address _address, uint256 level) external onlyAllowedOperator{

         if(level==4){
            LV4Reward(_address);
        }
         if(level==5){
            LV5Reward(_address);
        }
    }

    function GiveReward(uint256 level,uint256 tokenId, address contractAddress) external onlyAllowedOperator{
        if(level==3){
            if(contractAddress==address(zspContract)){
                Lv3Reward(tokenId);
            }
        }
    }
    function Lv3Reward(uint256 tokenId)  internal{

            zspContract.setSpecial(tokenId,true);
    
    }
     function LV4Reward(address _address) internal{
            addToWhitelist(_address,1);
    }
     function LV5Reward(address _address)  internal{
            setSpecialClaim(_address);
            addToWhitelist(_address,MAX_WHITELIST-whitelist_count);
    }
}
