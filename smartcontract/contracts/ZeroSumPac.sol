// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./Maze.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
contract ZeroSumPac is ERC721Enumerable, Ownable {
    uint256 public nextTokenId;
    mapping(address => bool) public approvedMintContracts;
    //TODO remember to check total supply before minting
    //TODO ways to add special trait in future/ eg default map to normal, if it has a speicial tag, maps to animated

    // Pass msg.sender to Ownable's constructor
    constructor() ERC721("ZSP", "ZSP") Ownable(msg.sender) {}
    uint256 maxSupply = 666; // TBD
    uint256 whitelistPrice = 0.015 ether; //TBD
    uint256 mintPrice = 0.015 ether; //TBD
    uint256 public maxPublicPerTransaction = 4;

    struct MintWindows {
        uint256 whitelistStartTime;
        uint256 whitelistEndTime;
        uint256 publicMintStartTime;
        uint256 publicMintEndTime;
    }
    MintWindows public mintWindows;
    mapping(address => uint256) public whitelistMinted;
    bytes32 public whitelistMerkleRoot;


    mapping(uint256 => bool) public specialTrait;
    string public _baseTokenURI;

    Maze public mazeContract;
    mapping(address => bool) public allowedOperators;
    

    modifier onlyAllowedOperator() {
        require(allowedOperators[msg.sender] || msg.sender == owner(), "Not allowed");
        _;
    }
    function setOperator(address _operator,bool allowed) external onlyOwner {
        allowedOperators[_operator]=allowed;
    }

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
    function adjustMintPrice(uint256 price) external onlyOwner{
        mintPrice=price;
    }
    function adjustWhitelistPrice(uint256 price) external onlyOwner{
        whitelistPrice=price;
    }
     function adjustMaxPublic(uint256 amount) external onlyOwner{
        maxPublicPerTransaction=amount;
    }
     function setWhitelistMerkleRoot(bytes32 _merkleRoot) external onlyOwner {
        whitelistMerkleRoot = _merkleRoot;
    }


    function ownerMint(address to, uint256 amount) external onlyOwner hasStock(amount){

        _batchMint(to,amount);
    }

    function whitelistMint(uint256 amount,uint256 maxAllowed, bytes32[] calldata merkleProof) external payable hasStock(amount){
        require(
            block.timestamp >= mintWindows.whitelistStartTime &&
                block.timestamp <= mintWindows.whitelistEndTime,
            "Whitelist mint not active"
        );
        require(msg.value*amount>=whitelistPrice,"Insufficient Fund");
        require(
            whitelistMinted[msg.sender] + amount <= maxAllowed,
            "Exceeds whitelist allowance"
        );
        bytes32 leaf = keccak256(abi.encodePacked(msg.sender, maxAllowed));
        require(
            MerkleProof.verify(merkleProof, whitelistMerkleRoot, leaf),
            "Invalid Merkle proof"
        );

        whitelistMinted[msg.sender] += amount;
        _batchMint(msg.sender, amount);
    }

    function publicMint(uint256 amount) external payable hasStock(amount){
        require(msg.value*amount>=mintPrice,"Insufficient Fund");
        require(amount<maxPublicPerTransaction,"Mint too many");
        require(
            block.timestamp >= mintWindows.publicMintStartTime &&
                block.timestamp <= mintWindows.publicMintEndTime,
            "Public mint not active"
        );
        _batchMint(msg.sender,amount);
        
    }
   function setMintWindows(
        uint256 _whitelistStartTime,
        uint256 _whitelistEndTime,
        uint256 _publicMintStartTime,
        uint256 _publicMintEndTime
    ) external onlyOwner {

        mintWindows = MintWindows(
            _whitelistStartTime,
            _whitelistEndTime,
            _publicMintStartTime,
            _publicMintEndTime
        );
    }

    function setApprovedMinter(address _contract,bool allows) external onlyOwner {
        approvedMintContracts[_contract] = allows;
    }

    function mintFromApprovedContract(address to,uint256 amount) external hasStock(amount){
        require(approvedMintContracts[msg.sender], "Not an approved minter");
        _batchMint(to, amount);

    }

    function setSpecial(uint256 tokenId,bool isSpecial) public onlyAllowedOperator{
         specialTrait[tokenId]=isSpecial;
    }

    

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function _baseURI() internal view override returns (string memory) {
        return _baseTokenURI;
    }
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(tokenId<totalSupply(), "token does not exist");

        if (specialTrait[tokenId]) {
            return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId), "-special"));
        }

        return string(abi.encodePacked(_baseTokenURI, Strings.toString(tokenId)));
    }

      function withdraw() external onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
    
}
