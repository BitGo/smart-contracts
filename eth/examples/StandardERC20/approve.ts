import { Contract } from '../../../src/contract';

const tokenName = 'DAI';
const recipient = '0xadd62287c10d90f65fd3bf8bf94183df115c030a';
const tokenAmount = 1e18; // 1 DAI

const daiContract = new Contract('StandardERC20').instance(tokenName);

const { data, amount, address } = daiContract.methods().approve.call({ _spender: recipient, _value: tokenAmount.toString(10) });

console.log(`To approve ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
