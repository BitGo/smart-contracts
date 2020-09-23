import { Contract } from '../../src/contract';
  
const workLockContract = new Contract('WorkLock');

let { data, amount, address } = workLockContract.methods()
  .cancelBid.call({ _value: 20 });

console.log(`\nTo cancel bid on WorkLock, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
