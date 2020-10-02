import { Contract } from '../../src/contract';

const tokenName = 'UNI-V2-ETH-DAI';
const recipient = '0x793F2aA4Cd841A2a64a8AB928ce6011662f565Fe';
const tokenAmount = 908657350098029009; 

const daiContract = new Contract('StandardERC20').instance(tokenName);

const { data, amount, address } = daiContract.methods().transfer.call({ _to: recipient, _value: tokenAmount.toString(10) });

console.log(`To transfer ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
