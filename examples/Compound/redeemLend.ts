import { Contract } from '../../src/contract';

const compoundTokenName = 'cDAI';
const redeemAmount = 49e8; // 49 cDAI

const compoundTokenContract = new Contract('Compound').instance(compoundTokenName);

const { data, amount, address } = compoundTokenContract.methods().redeem({ redeemTokens: redeemAmount.toString(10) });

console.log(`\nTo redeem ${redeemAmount} ${compoundTokenName} compound tokens, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
