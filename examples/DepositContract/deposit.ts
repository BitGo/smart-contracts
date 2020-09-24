import { Contract } from '../../src/contract';

const depositContractAddress = '0x'; // this is not yet known
const validatorKey = '0x0000';
const withdrawalKey = '0x0000';
const signature = '0x0000';
const depositDataRoot = '0x0000';

const depositContract = new Contract('DepositContract').address(depositContractAddress);

let { data, amount, address } = depositContract.methods()
  .deposit.call({ pubkey: validatorKey, withdrawal_credentials: withdrawalKey, signature: signature, deposit_data_root: depositDataRoot });

console.log(`\nTo deposit into the ETH2.0 deposit contract with validator key ${validatorKey}, withdrawalKey: ${withdrawalKey}, signature: ${signature}, depositDataRoot: ${depositDataRoot}, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
