import { getContractsFactory } from '../../../src/index';
/** This example should provide just a methoid */

const tokenName = 'WBTC';

const contract = getContractsFactory('trx').getContract('WrappedTokenFactory').instance(tokenName);

const custodianDepositAddress = '0xEeD5D8E8FaB6f5cBd6e1b14FC75FE4f14ee503dB';
const txId = 'f3b566050a4b57ca2acd1acdf9221a911d3740d9e7f9e0f3ddb468988f454ea1';
const amount = '18';

const response = contract.methods().addMintRequest.call({ amount: amount, txid: txId, depositAddress: custodianDepositAddress });

console.log('encoded', response);


const decoder = getContractsFactory('trx').getDecoder();

const data = response.data;
console.log(10, data );
/** Decode with string data */
const decodedFromString = decoder.decode(data);
console.log(`\n AddMintRequest decoded from string: \n`, decodedFromString);
/** Decode with Buffer data*/
const decodedFromBuffer = decoder.decode(Buffer.from(data.slice(2), 'hex'));
console.log(`\n AddMintRequest decoded from Buffer: \n`, decodedFromBuffer);
