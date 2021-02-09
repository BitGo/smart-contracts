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
  {
    data: '2bf90baae56b297abc4ac59b0416123b2b0cc43f68e8932b84df04350fad7d27d6ff349a',
    expected: { methodId: '0x2bf90baa',
      name: 'confirmMintRequest',
      args:
     [{ name: 'requestHash',
       type: 'bytes32',
       value:
          '0xe56b297abc4ac59b0416123b2b0cc43f68e8932b84df04350fad7d27d6ff349a' }],
      contractName: 'WrappedTokenFactory' },
  },
  {
    data: '4e71e0c8',
    expected: { methodId: '0x4e71e0c8',
      name: 'claimOwnership',
      args: [],
      contractName: 'WrappedTokenMembers' },
  },
  {
    data: '8e24a7640000000000000000000000000000000000000000000000000000000252ad4ddc000000000000000000000000000000000000000000000000000000000000006000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000000000004032306138343534336231363262663663373230653766393937653534323963363836613534616665626664393239613433386138376565653737343732616566000000000000000000000000000000000000000000000000000000000000002233504153766f413976314a4c784875316b79567a336e3447566f6732334769364a79000000000000000000000000000000000000000000000000000000000000',
    expected: { methodId: '0x8e24a764',
      name: 'addMintRequest',
      args:
        [{ name: 'amount', type: 'uint256', value: '9977023964' },
          { name: 'txid',
            type: 'string',
            value:
              '20a84543b162bf6c720e7f997e5429c686a54afebfd929a438a87eee77472aef' },
          { name: 'depositAddress',
            type: 'string',
            value: '3PASvoA9v1JLxHu1kyVz3n4GVog23Gi6Jy' }],
      contractName: 'WrappedTokenFactory' },
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
