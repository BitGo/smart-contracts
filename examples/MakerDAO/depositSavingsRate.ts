import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';

const daiToken = new Contract('StandardERC20').instance('dai');
const dsrManager = new Contract('DsrManager');

// TODO: Set your own address here -- this is the address who can withdraw DAI from the DSR
const ownerAddress = '0x0000000000000000000000000000000000000000'
// TODO: Set the desired amount of DAI to deposit in base units, so 1e18 is 1 DAI
const depositAmount = 1e18;

// ============================================ //
// ============================================ //

// First We need to approve ownership of some of our DAI to the DSR Manager

let { data, amount, address } = daiToken.methods()
  .approve.call({
    _spender: dsrManager.getAddress(),
    _value: depositAmount.toString(10),
  });

console.log(`\nTo approve ${depositAmount} DAI base units to the DSR Manager, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);


// ============================================ //
// ============================================ //


// Now we can actually deposit it and get the DSR

({ data, amount, address } = dsrManager.methods()
  .join.call({
    dst: ownerAddress,
    wad: depositAmount.toString(10),
  }));

console.log(`\nTo deposit ${depositAmount} DAI base units into the DSR`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
