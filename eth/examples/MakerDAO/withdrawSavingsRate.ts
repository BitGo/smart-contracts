import { getContractsFactory } from '../../../src/index';

const dsrManager = getContractsFactory('eth').getContract('DsrManager').instance();

// TODO: Set your own address here -- this is the address who can withdraw DAI from the DSR
const ownerAddress = '0x0000000000000000000000000000000000000000';

/*
 * ============================================ //
 * ============================================ //
 */

// Withdraw all DAI From the DSR

const { data, amount } = dsrManager.methods()
  .exitAll.call({
    dst: ownerAddress,
  });

console.log(`\nTo withdraw all DAI from the DSR`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${dsrManager.address}`);
