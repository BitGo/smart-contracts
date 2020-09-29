import { Contract } from '../../src/contract';
  
const tokenName = 'UNI-USDC';

const poolContract = new Contract('UNIPool').instance(tokenName);

const { data, amount, address } = poolContract.methods().exit.call({});

console.log(`Data: ${data}`);
console.log(`To: ${address}`);
