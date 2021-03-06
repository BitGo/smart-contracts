import { getContractsFactory } from '../../../src/index';

const underlyingTokenName = 'DAI';
const compoundTokenName = 'cDAI';
const lendAmount = 1e18; // 1 DAI

const underlyingTokenContract = getContractsFactory('eth').getContract('StandardERC20').instance(underlyingTokenName);
const compoundTokenContract = getContractsFactory('eth').getContract('Compound').instance(compoundTokenName);

// First we need to approve the amount of DAI for the compound DAI contract to control
let { data, amount } = underlyingTokenContract.methods().approve.call(
  {
    _spender: compoundTokenContract.address,
    _value: lendAmount.toString(10),
  });

console.log(`To approve ${lendAmount} ${underlyingTokenName} to compound token contract, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${underlyingTokenContract.address}`);


// Then, once the above tx is confirmed, we can mint our new cTokens
({ data, amount } = compoundTokenContract.methods().mint.call({ mintAmount: lendAmount.toString(10) }));

console.log(`\nTo exchange ${lendAmount} ${underlyingTokenName} for compound tokens, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${compoundTokenContract.address}`);
