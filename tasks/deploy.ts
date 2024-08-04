import { task } from 'hardhat/config';

/**
 *  task('deployConract', 'Deploy my contract')                         // npx hardhat deployConract --network sepolia
 */
task('deployContract', 'Deploy my contract')
  .setAction(async () => {
    const NFT1155Test = await hre.ethers.deployContract('MyNFT1155');
    console.log('[ ] The contract deployed successfully at: ', await NFT1155Test.getAddress());
  })