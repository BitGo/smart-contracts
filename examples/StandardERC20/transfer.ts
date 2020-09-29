import { Contract } from '../../src/contract';

const tokenName = 'UNI-V2-ETH-USDC';
const recipient = '0x7fba4b8dc5e7616e59622806932dbea72537a56b';
const tokenAmount = 436985605376

const daiContract = new Contract('StandardERC20').instance(tokenName);

const { data, amount, address } = daiContract.methods().transfer.call({ _to: recipient, _value: tokenAmount.toString(10) });

console.log(`To transfer ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
