import { getContractsFactory } from '../../../src/index';
/** This example should provide just a methoid */

const tokenName = 'WBTC-TRON';

const contract = getContractsFactory('trx').getContract('WrappedToken').instance(tokenName);

const result = contract.methods().pause.call({});
console.log(result.data);

const decoder = getContractsFactory('trx').getDecoder();

const wbtcData = result.data.slice(2);
const decoded = decoder.decode(Buffer.from(wbtcData, 'hex'));
console.log(`\nTransfer decoded : cbce51775299bc0b2c87bd0724d6c1e72f7d2d3f0f82c68c1ec0155772a5c9b4 \n`, decoded);

