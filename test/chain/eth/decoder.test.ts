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
    data: '0xa9059cbb00000000000000000000000010d4f942617a231eb1430c88fe43c8c2050437d90000000000000000000000000000000000000000000000000000000000002710',
    expected: {
      contractName: 'WrappedToken',
      name: 'transfer',
      methodId: '0xa9059cbb',
      args: [
        { name: '_to', type: 'address', value: '0x10d4f942617a231eb1430c88fe43c8c2050437d9' },
        { name: '_value', type: 'uint256', value: '10000' },
      ],
    },
  },
  {
    data: '0xc2998238000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000010000000000000000000000004ddc2d193948926d02f9b1fe9e1daa0718270ed5',
    expected: {
      contractName: 'CompoundComptroller',
      name: 'enterMarkets',
      methodId: '0xc2998238',
      args: [
        { name: 'cTokens', type: 'address[]', value: ['0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5'] },
      ],
    },
  },
  {
    data: '0xeb0dff66000000000000000000000000f7aba9b064a12330a00eafaa930e2fe8e76e65f0',
    expected: {
      contractName: 'DsrManager',
      name: 'exitAll',
      methodId: '0xeb0dff66',
      args: [
        { name: 'dst', type: 'address', value: '0xf7aba9b064a12330a00eafaa930e2fe8e76e65f0' },
      ],
    },
  },
  {
    data: '0x39125215000000000000000000000000b19fb72b55f5374a062ddcba874e566b1d93f5d3000000000000000000000000000000000000000000000000016345785d8a000000000000000000000000000000000000000000000000000000000000000000c0000000000000000000000000000000000000000000000000000000005f7cde11000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000000000000000000000e0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000416508bd6fc3da79ff7e5b84ff79f50e48112579d7b5190caeb92fd7cb4d2ac0f362f431480770e9bbe7e1437d7c21b49a64e03e5f1cfb0eaf3f84f2435b972fdc1b00000000000000000000000000000000000000000000000000000000000000',
    expected: {
      contractName: 'WalletSimple',
      name: 'sendMultiSig',
      methodId: '0x39125215',
      args: [
        { name: 'toAddress',
          type: 'address',
          value: '0xb19fb72b55f5374a062ddcba874e566b1d93f5d3' },
        { name: 'value', type: 'uint256', value: '100000000000000000' },
        { name: 'data', type: 'bytes', value: '0x' },
        { name: 'expireTime', type: 'uint256', value: '1602018833' },
        { name: 'sequenceId', type: 'uint256', value: '1' },
        { name: 'signature',
          type: 'bytes',
          value:
            '0x6508bd6fc3da79ff7e5b84ff79f50e48112579d7b5190caeb92fd7cb4d2ac0f362f431480770e9bbe7e1437d7c21b49a64e03e5f1cfb0eaf3f84f2435b972fdc1b' },
      ],
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
  const chainName = 'eth';
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

  it('Should be able to decode various function calls with a string hex data', function() {
    for (const { data, expected } of testCases) {
      expect(decoder.decode(data)).toEqual(expected);
    }
  });

  it('Should fail to decode an unknown function call', function() {
    for (const data of failCases) {
      expect(() => decoder.decode(Buffer.from(stripHexPrefix(data), 'hex'))).toThrow('Unknown method');
    }
  });
});
