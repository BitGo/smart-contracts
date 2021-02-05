import { getContractsFactory } from '../../../src/index';
/** This example should provide just a methoid */

const tokenName = 'WBTC-TRON';

const contract = getContractsFactory('trx').getContract('WrappedToken').instance(tokenName);

const result = contract.methods().pause.call({});
console.log(result.data);
