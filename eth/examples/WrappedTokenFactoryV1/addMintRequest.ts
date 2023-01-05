import { getContractsFactory } from '../../../src/index';

const tokenName = 'WDOGE';

const contract = getContractsFactory('eth').getContract('WrappedTokenFactoryV1').instance(tokenName);

const custodianDepositAddress = '0xd5ADdE17feD8baed3F32b84AF05B8F2816f7b560';
const txId = 'f3b566050a4b57ca2acd1acdf9221a911d3740d9e7f9e0f3ddb468988f454ea1';
const amount = '10';

const result = contract.methods().addMintRequest.call({ amount: amount, txid: txId, depositAddress: custodianDepositAddress });
console.log('encoded', result);

const decoder = getContractsFactory('eth').getDecoder();

const data = result.data;
console.log(data);

/** Decode with string data */
const decodedFromString = decoder.decode(data);
console.log(`\n AddMintRequest decoded from string: \n`, decodedFromString);

/** Decode with Buffer data*/
const decodedFromBuffer = decoder.decode(Buffer.from(data.slice(2), 'hex'));
console.log(`\n AddMintRequest decoded from Buffer: \n`, decodedFromBuffer);
