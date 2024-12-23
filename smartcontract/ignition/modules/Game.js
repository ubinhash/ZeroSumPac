// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Game", (m) => {

  const zsp = m.contract("ZeroSumPac");
  const game = m.contract("Game");
  const maze = m.contract("Maze");
  const reward = m.contract("Reward");
  const gameequip = m.contract("GameEquip");
  
  m.call(maze,"setOperator",[zsp,true],{ id: "a1"})
  m.call(maze,"setOperator",[game,true],{ id: "a2"})
  m.call(maze,"setGameEquipContract",[gameequip],{ id: "a3"})
  m.call(gameequip,"setGameContract",[game],{id:"a4"});
  m.call(game,"setAllowedNFTContract",[zsp,true],{ id: "a5"})
  m.call(game,"setMazeContract",[maze],{ id: "a6"})
  m.call(game,"setOperator",[gameequip,true],{ id: "a7"})
  m.call(game,"setRewardContract",[reward],{ id: "a7_2"})

  m.call(zsp,"setMazeContract",[maze],{ id: "a8"})
  m.call(zsp,"setRewardContract",[reward],{ id: "a8_2"})
  m.call(zsp,"setOperator",[reward,true],{ id: "a9"})
  m.call(zsp,"setApprovedMinter",[reward,true],{ id: "a9_2"})

  m.call(reward,"setOperator",[game,true],{ id: "a10"})
  m.call(reward,"setZSPContract",[zsp],{ id: "a11"})
  
  m.call(reward,"mintAndStoreNFT",[11],{ id: "b"})

  // m.call(maze,"unlockMaze",[0,true],{ id: "b"})

  m.call(zsp,"ownerMint",["0x384C2BbE16A3560cc15E3AC43cf3c9FFEA3dd42F",5],{id:"c"})

    //TESTNET
  // m.call(zsp,"setMintWindows",[0,0,0,1796688000],{id:"c2"})
  // m.call(game,"enterGame",[zsp,11,0,1,1],{ id: "d"})
  // m.call(zsp,"setBaseURI",["https://storage.googleapis.com/zsp-storage/shape-sepolia/metdata/"],{ id: "e"})

  //   //MAINNET
  m.call(zsp,"setMintWindows",[0,0,0,0],{id:"c2"})
  m.call(zsp,"setBaseURI",["https://storage.googleapis.com/zsp-storage/shape-mainnet/metadata/"],{ id: "e"})

// REMEMBER TO EDIT gameequip during mainnet deployment
  return { game };
});
