import { Contract } from '../../src/contract';
  
const tokenName = 'UNI-V2-ETH-DAI';
const tokenAmount = 947074854133647025218

const poolContract = new Contract('UNIPool').instance(tokenName);
let pool = poolContract.methods().stake.call({ amount: tokenAmount.toString(10) });

const tokenContract = new Contract('StandardERC20').instance(tokenName);
let approve = tokenContract.methods().approve.call({ _spender: pool.address, _value: tokenAmount.toString(10) });

console.log(`---- To approve ${tokenName} ${tokenAmount.toString(10)}:\n`);
console.log(`${approve.data}`);
console.log(`${approve.address}\n`);
console.log(`------ and stake -------\n`);
console.log(`${pool.data}`);
console.log(`${pool.address}`);
