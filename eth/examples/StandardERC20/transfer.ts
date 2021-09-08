import { getContractsFactory } from '../../../src/index';

const tokenName = 'DAI';
const recipient = '0xadd62287c10d90f65fd3bf8bf94183df115c030a';
const tokenAmount = 1e18; // 1 DAI

const daiContract = getContractsFactory('eth').getContract('StandardERC20').instance(tokenName);

const { data, amount } = daiContract.methods().transfer.call({ _to: recipient, _value: tokenAmount.toString(10) });

console.log(`To transfer ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${daiContract.address}`);

const decoder = getContractsFactory('eth').getDecoder();

const wbtcData = data.slice(2);
const decoded = decoder.decode(Buffer.from(wbtcData, 'hex'));
console.log(`\nTransfer decoded : \n`, decoded);
