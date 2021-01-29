import { getContractsFactory } from '../../../src/index2';

/*
 * Note that to borrow, you must have a certain amount of assets lent to the compound protocol.
 * You must also explicitly enable those assets to be used as collateral
 */

const collateralTokenName = 'cDAI';
const borrowTokenName = 'USDC';
const compoundTokenName = 'cUSDC';
const borrowAmount = 1e5;

const compoundComptroller = getContractsFactory('eth').getContract('CompoundComptroller').instance();
const compoundCollateralTokenContract = getContractsFactory('eth').getContract('Compound').instance(collateralTokenName);

// First we need to "enter the market" for our collateral token. This assumes that we already have some cTokens to use
let { data, amount } = compoundComptroller.methods()
  .enterMarkets.call({ cTokens: [compoundCollateralTokenContract.address] });

console.log(`\nTo enter ${collateralTokenName} as collateral for borrowing, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${compoundComptroller.address}`);

// Once the above tx is confirmed, we can borrow our desired underlying asset
const compoundTokenContract = getContractsFactory('eth').getContract('Compound').instance(compoundTokenName);

({ data, amount } = compoundTokenContract.methods()
  .borrow.call({ borrowAmount: borrowAmount.toString(10) }));

console.log(`\nTo borrow ${borrowAmount} ${borrowTokenName} from compound, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${compoundTokenContract.address}`);
