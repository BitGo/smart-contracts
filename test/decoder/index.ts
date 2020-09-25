const expect = require('expect'); // tslint:disable-line
import { stripHexPrefix } from '../../src/util/string';
import { Decoder, FunctionCallExplanation } from '../../src';

interface TestCase {
    data: string;
    expected: FunctionCallExplanation;
}

const testCases: TestCase[] = [
  {
    data: '0xa9059cbb00000000000000000000000010d4f942617a231eb1430c88fe43c8c2050437d90000000000000000000000000000000000000000000000000000000000002710',
    expected: {
      contractName: 'StandardERC20',
      name: 'transfer',
      methodId: '0xa9059cbb',
      args: [
        { name: '_to', type: 'address', value: '0x10d4f942617a231eb1430c88fe43c8c2050437d9' },
        { name: '_value', type: 'uint256', value: 10000 },
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
];

const failCases: string[] = [
  '0x1234123412341234',
  '0x',
  '0x00',
  '0xabcd',
];


describe('Decoder', () => {
  let decoder: Decoder;

  before(() => {
    decoder = new Decoder();
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
