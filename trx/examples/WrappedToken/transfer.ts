import { getContractsFactory } from '../../../src/index';

const tokenName = 'WBTC';
const recipient = 'TGeT2sfMYcjx3ra2HhQUvMyBcVhjBc1Lbk';
const tokenAmount = 1e8; // 1 WBTC on Tron

const contract = getContractsFactory('trx').getContract('WrappedToken').instance(tokenName);

const wbtcContract = contract.methods().transfer.call({ _to: recipient, _value: tokenAmount.toString(10) });

const { data, amount } = wbtcContract;
console.log(`To transfer ${tokenAmount} ${tokenName} to ${recipient}:\n`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount}`);
console.log(`To: ${contract.address}`);


const decoder = getContractsFactory('trx').getDecoder();

const wbtcData = data.slice(2);
const decoded = decoder.decode(Buffer.from(wbtcData, 'hex'));
console.log(`\nTransfer decoded : cbce51775299bc0b2c87bd0724d6c1e72f7d2d3f0f82c68c1ec0155772a5c9b4 \n`, decoded);


const randomDecoded = decoder.decode(Buffer.from('a9059cbb000000000000000000000000efc230e125c24de35f6290afcafa28d50b43653600000000000000000000000000000000000000000000000000000000000003e8', 'hex'));
console.log(`\nDecoded random transfer from tronscan, hash ref : cbce51775299bc0b2c87bd0724d6c1e72f7d2d3f0f82c68c1ec0155772a5c9b4 \n`, randomDecoded);
