# TO VERIFY
npx hardhat verify \
 --network shapeSepolia \
  <address> \
  [...constructorArgs]

# TO DEPLOY

npx hardhat ignition deploy ./ignition/modules/Lock.js --network shapeSepolia     

# TO TEST
 npx hardhat test     
 
 npx hardhat compile