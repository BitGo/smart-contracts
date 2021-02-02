import { getContractsFactory } from '../../../src/index2';

const repayTokenName = 'USDC';
const compoundTokenName = 'cUSDC';
const repayAmount = 1e5; // 0.1 USDC

const underlyingTokenContract = getContractsFactory('eth').getContract('StandardERC20').instance(repayTokenName);
const compoundTokenContract = getContractsFactory('eth').getContract('Compound').instance(compoundTokenName);

// First we need to approve the amount of DAI for the compound DAI contract to control
let { data, amount, address } = underlyingTokenContract.methods().approve.call(
  {
    _spender: compoundTokenContract.address,
    _value: repayAmount.toString(10),
  });

console.log(`To approve ${repayAmount} ${repayTokenName} to compound token contract, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);

// Then we can tell the compound contract that we want to repay
({ data, amount, address } = compoundTokenContract.methods().repayBorrow.call({ repayAmount: repayAmount.toString(10) }));

console.log(`\nTo repay ${repayAmount} ${repayTokenName} from compound, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${compoundTokenContract.address}`);
