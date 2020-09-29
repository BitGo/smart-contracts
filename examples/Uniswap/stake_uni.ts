import { Contract } from '../../src/contract';
  
const tokenName = 'UNI-USDC';
const tokenAmount = 428043827671 //0.00000044 * 1e18;

const poolContract = new Contract('UNIPool').instance(tokenName);

const { data, amount, address } = poolContract.methods().stake.call({ amount: tokenAmount });

console.log(`To stake ${tokenAmount}:\n`);
console.log(`Data: ${data}`);
console.log(`To: ${address}`);
