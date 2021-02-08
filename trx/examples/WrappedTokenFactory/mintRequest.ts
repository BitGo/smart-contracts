import { getContractsFactory } from '../../../src/index';
/** This example should provide just a methoid */

const tokenName = 'WBTC-TRON';

const contract = getContractsFactory('trx').getContract('WrappedTokenFactory').instance(tokenName);

const custodianDepositAddress = '0xEeD5D8E8FaB6f5cBd6e1b14FC75FE4f14ee503dB';
const txId = 'f3b566050a4b57ca2acd1acdf9221a911d3740d9e7f9e0f3ddb468988f454ea1';
const amount = '18';

const response = contract.methods().addMintRequest.call({ amount: amount, txid: txId, depositAddress: custodianDepositAddress });

console.log('encoded', response);


const decoder = getContractsFactory('trx').getDecoder();

const data = response.data.slice(2);
const decoded = decoder.decode(Buffer.from(data, 'hex'));
console.log(`\n AddMintRequest decoded : cbce51775299bc0b2c87bd0724d6c1e72f7d2d3f0f82c68c1ec0155772a5c9b4 \n`, decoded);
