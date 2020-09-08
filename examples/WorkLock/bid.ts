import { Contract } from '../../src/contract';

const workLockContract = new Contract('WorkLock');

let { data, amount, address } = workLockContract.methods()
  .bid.call({ payableAmount: 20 });

console.log(`\nTo bid on WorkLock, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);

