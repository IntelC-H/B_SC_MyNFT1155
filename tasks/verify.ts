/**
 *  task('verifyContract', 'Verify my contract')                        // npx hardhat verifyContract --addr [Conrtact address] --network sepolia
 */
import { task } from 'hardhat/config';

task('verifyContract', 'Verify my contract')
  .addParam('addr', 'the address of the deployed contract')
  .setAction(async (taskArgs) => {
    await hre.run('verify:verify', {
      address: taskArgs.addr,
      constructorAgument: []
    });
    console.log('[ ] The contract verified successfully at: ', taskArgs.addr);
  })