import { getContractsFactory } from '../../../src/index';

const underlyingTokenName = 'DAI';
const aaveTokenName = 'aDAI';
const repayAmount = 1e18; // 1 DAI
const owner = '0xDa0c181Ae675092c58a4F90b2af4E6be1E79b4D0';

const underlyingTokenContract = getContractsFactory('eth').getContract('StandardERC20').instance(underlyingTokenName);
const aaveTokenContract = getContractsFactory('eth').getContract('Aave').instance(aaveTokenName);

/*
 *  _reserve: address of the underlying asset
 *  _amount : amount to repay, expressed in decimal units.
 *  _onBehalfOf: address to repay on behalf of. If the caller is repaying their own loan, then this value should be equal to msg.sender
 */

const { data, amount } = aaveTokenContract.methods().repay.call(
  { _reserve: underlyingTokenContract.address,
    _amount: repayAmount.toString(10),
    _onBehalfOf: owner,
  },
);

console.log(`\nTo repay ${repayAmount} ${underlyingTokenName} for aave tokens, repay:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${aaveTokenContract.address}`);
