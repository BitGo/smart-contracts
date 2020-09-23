import { Contract } from '../../src/contract';
  
const workLockContract = new Contract('WorkLock');

let { data, amount, address } = workLockContract.methods()
  .getBiddersLength.call({ _value: 20 });

console.log(`\nTo get bidders count on WorkLock, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
