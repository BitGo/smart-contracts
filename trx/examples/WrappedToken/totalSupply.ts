import { getContractsFactory } from '../../../src/index';
/** This example should provide just a methoid */

const tokenName = 'WBTC-TRON';

const contract = getContractsFactory('trx').getContract('WrappedToken').instance(tokenName);

const { data } = contract.methods().pause.call({});
console.log(data);

const slicedData = data.slice(2);
console.log(slicedData);
console.log(getContractsFactory('trx').getDecoder().decode(Buffer.from(slicedData, 'hex')));
