import { Contract } from '../../src/contract';

const underlyingTokenName = 'DAI';
const compoundTokenName = 'cDAI';
const lendAmount = 1e18; // 1 DAI

const underlyingTokenContract = new Contract('StandardERC20').instance(underlyingTokenName);
const compoundTokenContract = new Contract('Compound').instance(compoundTokenName);

// First we need to approve the amount of DAI for the compound DAI contract to control
let { data, amount, address } = underlyingTokenContract.methods().approve.call(
  {
    _spender: compoundTokenContract.getAddress(),
    _value: lendAmount.toString(10),
  });

console.log(`To approve ${lendAmount} ${underlyingTokenName} to compound token contract, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);


// Then, once the above tx is confirmed, we can mint our new cTokens
({ data, amount, address } = compoundTokenContract.methods().mint.call({ mintAmount: lendAmount.toString(10) }));

console.log(`\nTo exchange ${lendAmount} ${underlyingTokenName} for compound tokens, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
