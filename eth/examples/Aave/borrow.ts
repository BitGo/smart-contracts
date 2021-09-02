import { getContractsFactory } from '../../../src/index';

const underlyingTokenName = 'DAI';
const aaveTokenName = 'aDAI';
const borrowAmount = 1e18; // 1 DAI

const underlyingTokenContract = getContractsFactory('eth').getContract('StandardERC20').instance(underlyingTokenName);
const aaveTokenContract = getContractsFactory('eth').getContract('Aave').instance(aaveTokenName);

/*
 * _reserve          : address of the underlying asset
 * _amount           : amount to borrow, expressed in decimal units
 * _interestRateMode : type of interest rate mode to use, with uint 2 representing variable rate and uint 1 representing stable rate
 * _referralCode     : referral code for our referral program
 */
const { data, amount } = aaveTokenContract.methods().borrow.call(
  { _reserve: underlyingTokenContract.address,
    _amount: borrowAmount.toString(10),
    _interestRateMode: 1,
    _referralCode: 0,
  },
);

console.log(`\nTo Borrow ${borrowAmount} ${underlyingTokenName} for aave tokens, borrow:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${aaveTokenContract.address}`);
