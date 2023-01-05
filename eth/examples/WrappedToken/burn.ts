import { getContractsFactory } from '../../../src/index';

const tokenName = 'WDOGE';

const contract = getContractsFactory('eth').getContract('WrappedToken').instance(tokenName);

const result = contract.methods().burn.call({ value: '10' });
console.log(result)

const decoder = getContractsFactory('eth').getDecoder();

const wdogeData = result.data.slice(2);
const decoded = decoder.decode(Buffer.from(wdogeData, 'hex'));
console.log(decoded)
