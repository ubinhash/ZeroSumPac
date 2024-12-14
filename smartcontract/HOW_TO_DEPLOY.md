# TO VERIFY
npx hardhat verify \
 --network shapeSepolia \
  <address> \
  [...constructorArgs]

# TO DEPLOY

npx hardhat ignition deploy ./ignition/modules/Lock.js --network shapeSepolia     
npx hardhat ignition deploy ./ignition/modules/Game.js --network shapeSepolia   --reset
# TO TEST
 npx hardhat test     
 
 npx hardhat compile
