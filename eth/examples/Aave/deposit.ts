import { getContractsFactory } from '../../../src/index';

const underlyingTokenName = 'DAI';
const aaveTokenName = 'aDAI';
const depositAmount = 1e18; // 1 DAI

const underlyingTokenContract = getContractsFactory('eth').getContract('StandardERC20').instance(underlyingTokenName);
const aaveTokenContract = getContractsFactory('eth').getContract('Aave').instance(aaveTokenName);

let { data, amount } = underlyingTokenContract.methods().approve.call(
  {
    _spender: underlyingTokenContract.address,
    _value: depositAmount.toString(10),
  });

console.log(`To approve ${depositAmount} ${underlyingTokenName} to aave token contract, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${underlyingTokenContract.address}`);

/*
 * _reserve : address of the underlying asset
 * _amount  : amount deposited, expressed in decimal units
 * _referralCode: referral code for Aave referral program
 */

({ data, amount } = aaveTokenContract.methods().deposit.call(
  { _reserve: underlyingTokenContract.address,
    _amount: depositAmount.toString(10),
    _referralCode: 0,
  },
));

console.log(`\nTo exchange ${depositAmount} ${underlyingTokenName} for aave tokens, deposit:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${aaveTokenContract.address}`);
