import { getContractsFactory } from '../../../src/index';

const tokenName = 'WDOGE';

const contract = getContractsFactory('eth').getContract('WrappedToken').instance(tokenName);

const result = contract.methods().transfer.call({_to: '0xd5ADdE17feD8baed3F32b84AF05B8F2816f7b560', _value: 12})
console.log(result)

const decoder = getContractsFactory('eth').getDecoder();

const wdogeData = result.data.slice(2);
const decoded = decoder.decode(Buffer.from(wdogeData, 'hex'));
console.log(decoded)

