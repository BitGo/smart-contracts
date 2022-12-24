import { getContractsFactory } from '../../../src/index';

const tokenName = 'WDOGE';

const contract = getContractsFactory('eth').getContract('WrappedTokenControllerV1').instance(tokenName);

const result = contract.methods().transferOwnership.call({ newOwner: '0xD037CA7A2B62c66B0F01CB2C93B978493dcD06d6' });
console.log(result)

const decoder = getContractsFactory('eth').getDecoder();

const wdogeData = result.data.slice(2);
const decoded = decoder.decode(Buffer.from(wdogeData, 'hex'));
console.log(decoded)

