// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/IERC1155Receiver.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IOtomsDatabase.sol";
contract GameEquip is  IERC1155Receiver,Ownable {
    mapping(address => bool) public allowedOperators;
    IOtomsDatabase public otomDatabase; // Reference to the ZSP contract using ERC721Enumerable
    IERC1155 public otomToken;
    IERC721 public eyesToken;
    IERC721 public keysToken;
    //later add our games's contract

    struct EyeEquip {
        uint256 playerId;  // The ID of the player who equipped the eyes
        bool isEquipped;       // Whether the eyes are currently in use
        uint256 equipTime;  // The time the eyes were equipped
    }

    mapping (uint256 => bool) public playerEquippedEyes; //playerid =>bool
    mapping(uint256 => EyeEquip) public eyesInfo;
    mapping (uint256 => bool) public playerEquippedKeys; //keys can only be used once
    mapping (uint256 => bool) public keysUsed; //keys can only be used once
    
    constructor() Ownable(msg.sender) {
        //Mainnet
        otomToken =IERC1155(0x2f9810789aebBB6cdC6c0332948fF3B6D11121E3);
        otomDatabase =IOtomsDatabase(0x953761a771d6Ad9F888e41b3E7c9338a32b1A346);
        eyesToken = IERC721(0xF3851e1b7824BD920350E6Fe9B890bb76d01C9f7);
        // keysToken = IERC721();

        //Testnet
         eyesToken = IERC721(0xAA394da7d62E502a7E3dA7e11d21A74c277143d5);
         keysToken = IERC721(0x01eB5CF188ba7d075FDf7eDF2BB8426b17CA3320);
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
    function setEyesToken(address _contractaddr) external onlyOwner {
        eyesToken=IERC721(_contractaddr);
    }
    function setKeysToken(address _contractaddr) external onlyOwner {
        keysToken=IERC721(_contractaddr);
    }


    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }

    // FUNCTIONS ON THE SHIELD

    function shield(uint256 tokenId) external returns (uint256) {
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

    function transferOutOTOM(address to,uint256 tokenId,uint256 amount) external onlyOwner {
            require(
                otomToken.balanceOf(address(this), tokenId) >= amount,
                "Insufficient token balance in contract"
            );
        otomToken.safeTransferFrom(address(this), to, tokenId, amount, "");
    }

    // FUNCTIONS ON THE EYES

    function equipEyes(uint256 playerid,uint256 eyesTokenId) external{
        // check if it has been equipped
        require(eyesToken.ownerOf(eyesTokenId) == msg.sender, "Not Owner");
        require(!eyesInfo[eyesTokenId].isEquipped==false,"Eyes has been used");
        require(!playerEquippedEyes[playerid],"You already equipped an eye");
        eyesInfo[eyesTokenId].isEquipped=true;
        eyesInfo[eyesTokenId].equipTime=block.timestamp;
        eyesInfo[eyesTokenId].playerId=playerid;
        playerEquippedEyes[playerid]=true;
    }
    function unequipEyes(uint256 eyesTokenId) external{
        //you must wait for a day before unequiping
        require(eyesInfo[eyesTokenId].equipTime + 86400 < block.timestamp,"You must wait a day");
        eyesInfo[eyesTokenId].isEquipped=false;
        playerEquippedEyes[eyesInfo[eyesTokenId].playerId]=false;
        eyesInfo[eyesTokenId].playerId=0;
    }

    

    // FUNCTIONS ON THE KEYS
    function equipKeys(uint256 playerid,uint256 keysTokenId) external{
        // check if it has been equipped
        require(keysToken.ownerOf(keysTokenId) == msg.sender, "Not Owner");
        require(keysUsed[playerid]==false,"Keys has been used");
        require(playerEquippedKeys[playerid] == false,"You already equipped a key");

        playerEquippedKeys[playerid]=true;
        keysUsed[keysTokenId]=true;
    }

    //---- IERC1155Receiver ---FUNCTIONS //

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






   
}
 