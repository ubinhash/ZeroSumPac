// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Game", (m) => {

  const zsp = m.contract("ZeroSumPac");
  const game = m.contract("Game");
  const maze = m.contract("Maze");
  const gameequip = m.contract("GameEquip");
  
  m.call(maze,"setOperator",[zsp,true],{ id: "a2"})
  m.call(maze,"setOperator",[game,true],{ id: "a2"})
  m.call(maze,"setGameEquipContract",[gameequip],{ id: "a3"})
  m.call(gameequip,"setGameContract",[game],{id:"a4"});
  m.call(game,"setAllowedNFTContract",[zsp,true],{ id: "a5"})
  m.call(game,"setMazeContract",[maze],{ id: "a6"})
  m.call(game,"setOperator",[gameequip,true],{ id: "a7"})
  m.call(zap,"setMazeContract",[maze],{ id: "a8"})

  m.call(maze,"unlockMaze",[0,true],{ id: "b"})
  m.call(zsp,"ownerMint",["0x384C2BbE16A3560cc15E3AC43cf3c9FFEA3dd42F",5],{id:"c"})
  m.call(game,"enterGame",[zsp,0,0,1,1],{ id: "d"})
  return { game };
});
