import { Contract } from '../../src/contract';

// Note that to borrow, you must have a certain amount of assets lent to the compound protocol.
// You must also explicitly enable those assets to be used as collateral

const collateralTokenName = 'cDAI';
const borrowTokenName = 'USDC';
const compoundTokenName = 'cUSDC';
const borrowAmount = 1e5;

const compoundComptroller = new Contract('CompoundComptroller'); // there is only 1, so no need for instance
const compoundCollateralTokenContract = new Contract('Compound').instance(collateralTokenName);

// First we need to "enter the market" for our collateral token. This assumes that we already have some cTokens to use
let { data, amount, address } = compoundComptroller.methods()
  .enterMarkets.call({ cTokens: [compoundCollateralTokenContract.getAddress()] });

console.log(`\nTo enter ${collateralTokenName} as collateral for borrowing, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);

// Once the above tx is confirmed, we can borrow our desired underlying asset
const compoundTokenContract = new Contract('Compound').instance(compoundTokenName);

({ data, amount, address } = compoundTokenContract.methods()
  .borrow.call({ borrowAmount: borrowAmount.toString(10) }));

console.log(`\nTo borrow ${borrowAmount} ${borrowTokenName} from compound, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
