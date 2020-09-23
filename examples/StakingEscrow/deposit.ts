import { Contract } from '../../src/contract';
  
const stakingEscrowContract = new Contract('StakingEscrow');

let { data, amount, address } = stakingEscrowContract.methods()
  .deposit.call({ _staker: '0xD4C5226e2108C722bB86ff8327727410dC120b42', _value: 20, _periods: 1 });

console.log(`\nTo deposit on StakingEscrow, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
