// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ZeroSumPac is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public approvedMintContracts;
    //TODO remember to check total supply before minting
    //TODO ways to add special trait in future/ eg default map to normal, if it has a speicial tag, maps to animated

    // Pass msg.sender to Ownable's constructor
    constructor() ERC721("ZSP", "ZSP") Ownable(msg.sender) {}

    function mint(address to) external onlyOwner {
        _safeMint(to, nextTokenId);
        nextTokenId++;
    }

    function _batchMint(address to, uint256 amount) internal {
        for (uint256 i = 0; i < amount; i++) {
            _safeMint(to, nextTokenId);
            nextTokenId++;
        }
    }

    function setApprovedMinter(address _contract,bool allows) external onlyOwner {
        approvedMintContracts[_contract] = allows;
    }

    function mintFromApprovedContract(address to,uint256 amount) external {
        require(approvedMintContracts[msg.sender], "Not an approved minter");
        _batchMint(to, amount);

    }
    
}
