import { getContractsFactory } from '../../src/index';
/** This example should provide just list of methods */

console.log(getContractsFactory('trx').getContract('WrappedToken').listMethods());
console.log(JSON.stringify(getContractsFactory('trx').getContract('WrappedTokenFactory').instance().methods(), null, 2));
console.log(getContractsFactory('trx').getContract('WrappedTokenController').listMethods());
console.log(getContractsFactory('trx').getContract('WrappedTokenMembers').listMethods());

