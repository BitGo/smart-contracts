import { getContractsFactory } from '../../src/index';
/** This example should provide just a method id */

const response = getContractsFactory('trx').getContract('WrappedToken');
console.log(response.listMethods());
