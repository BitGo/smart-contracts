import { getContractsFactory } from '../../../src';
import { Decoder, FunctionCallExplanation } from '../../../src/base/decoder/decoder';
import { stripHexPrefix } from '../../../src/util/string';
const expect = require('expect');

interface TestCase {
    data: string;
    expected: FunctionCallExplanation;
  }
  
const testCases: TestCase[] = [
  {
    data: '0xa9059cbb000000000000000000000000493cb0a093df510e760120820c5964c225542a470000000000000000000000000000000000000000000000000000000005f5e100',
    expected: { methodId: '0xa9059cbb',
      name: 'transfer',
      args:
     [{ name: '_to',
       type: 'address',
       value: 'TGeT2sfMYcjx3ra2HhQUvMyBcVhjBc1Lbk' },
     { name: '_value', type: 'uint256', value: '100000000' }],
      contractName: 'WrappedToken',
    },
  },
];
  
const failCases: string[] = [
  '0x1234123412341234',
  '0x',
  '0x00',
  '0xabcd',
];


describe('Decoder', () => {
  const chainName = 'trx';
  const ethFactory = getContractsFactory(chainName);
  let decoder: Decoder<FunctionCallExplanation>;
  
  before(() => {
    decoder = ethFactory.getDecoder();
  });
  
  it('Should be able to decode various function calls', function() {
    for (const { data, expected } of testCases) {
      expect(decoder.decode(Buffer.from(stripHexPrefix(data), 'hex'))).toEqual(expected);
    }
  });
  
  it('Should fail to decode an unknown function call', function() {
    for (const data of failCases) {
      expect(() => decoder.decode(Buffer.from(stripHexPrefix(data), 'hex'))).toThrow('Unknown method');
    }
  });
});
