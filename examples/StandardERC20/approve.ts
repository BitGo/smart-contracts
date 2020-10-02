import { Contract } from '../../src/contract';

const tokenName = 'UNI';
const recipient = '0x793F2aA4Cd841A2a64a8AB928ce6011662f565Fe';
const tokenAmount = 546345703250364; // 1 DAI

const daiContract = new Contract('StandardERC20').instance(tokenName);

const { data, amount, address } = daiContract.methods().approve.call({ _spender: recipient, _value: tokenAmount.toString(10) });

console.log(`To approve ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
