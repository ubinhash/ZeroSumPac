// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");



module.exports = buildModule("Reward", (m) => {

  const reward = m.contract("Reward");
  m.call(reward,"setZSPContract",["0x05bDB6E911EDC186eF8C113976198Cb2dd6E33d6"])
  return { reward };
});
