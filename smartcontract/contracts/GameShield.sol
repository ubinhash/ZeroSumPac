// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOtomsDatabase.sol";
contract GameShield is  IERC1155Receiver,Ownable {
    IOtomsDatabase public otomDatabase; // Reference to the ZSP contract using ERC721Enumerable
    IERC1155 public otomToken;

    
    mapping(address => bool) public allowedOperators;
    constructor() Ownable(msg.sender) {
        otomToken =IERC1155(0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3);
        otomDatabase =IOtomsDatabase(0x953761a771d6Ad9F888e41b3E7c9338a32b1A346);

    }

    modifier onlyAllowedOperator() {
        require(allowedOperators[msg.sender], "Not an allowed operator");
        _;
    }

    // Function to set the ZSP contract address (only callable by the owner)
    function setOtomToken(address _contractaddr) external onlyOwner {
        otomToken =IERC1155(_contractaddr);
    }
    function setOtomDatabase(address _contractaddr) external onlyOwner {
        otomDatabase =IOtomsDatabase(_contractaddr);
    }


    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    function parse(uint256 tokenId) external returns (uint256) {
        // Ensure the sender owns exactly 1 of the tokenId
        require(
            otomToken.balanceOf(msg.sender, tokenId) >= 1,
            "You must own at least one of this specified token."
        );
        require(
            otomToken.isApprovedForAll(msg.sender, address(this)),
            "Contract is not approved to transfer your tokens."
        );
        require(
            !compareStrings(otomDatabase.getMoleculeByTokenId(tokenId).bond.bondType,"singleton"),
            "Must be Molecule"
        );
    

        otomToken.safeTransferFrom(msg.sender, address(this), tokenId, 1, "");
        return readShieldAmount(tokenId);
    }

    function readShieldAmount(uint256 tokenId) public view returns (uint256) {

        Molecule memory molecule = otomDatabase.getMoleculeByTokenId(tokenId);
        uint256 computedValue =molecule.hardness * 2 + molecule.toughness*2; 
        return computedValue;

    }

    function onERC1155Received(
        address operator,
        address from,
        uint256 id,
        uint256 value,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155Received.selector;
    }

    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external override returns (bytes4) {
        return this.onERC1155BatchReceived.selector;
    }

    function supportsInterface(bytes4 interfaceId) public view override returns (bool) {
        return interfaceId == type(IERC1155Receiver).interfaceId;
    }

    function transferOutOTOM(address to,uint256 tokenId,uint256 amount) external onlyOwner {
            require(
                otomToken.balanceOf(address(this), tokenId) >= amount,
                "Insufficient token balance in contract"
            );
        otomToken.safeTransferFrom(address(this), to, tokenId, amount, "");
    }



   
}
 