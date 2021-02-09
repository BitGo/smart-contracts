import { ensure } from '../src/util/ensure';
import BigNumber from 'bignumber.js';

const generateNumber = (max: number) => {
  return (): string => {
    return BigNumber.random(18).times(max).integerValue(BigNumber.ROUND_FLOOR).toString(10);
  };
};

const generateSignedInteger = (max: number) => {
  return (): string => {
    const unsigned = generateNumber(max)();
    const sign = generateNumber(2)();
    return sign ? unsigned : (new BigNumber(unsigned).times(-1)).toString(10);
  };
};

const generateHexString = (length: number): () => string => {
  return () => {
    ensure(length % 2 === 0, `Invalid hex length: ${length}`);
    let result = '0x';
    for (let i = 0; i < length / 2; i++) {
      const byte = new BigNumber(generateNumber(256)());
      result += byte.toString(16);
    }
    return result;
  };
};

const generateHexStringArray = (strLength: number, arrLength: number): () => string[] => {
  return () => {
    const res: string[] = [];
    for (let i = 0; i < arrLength; i++) {
      res.push(generateHexString(strLength)());
    }
    return res;
  };
};

const generateFromOptions = (options: any[]) => {
  return () => {
    return options[Number(generateNumber(options.length)())];
  };
};

const solidityTypes: { [key: string]: any } = {
  uint: generateNumber(2e8),
  uint8: generateNumber(2e2),
  uint16: generateNumber(2e4),
  uint32: generateNumber(2e8),
  uint64: generateNumber(2e8),
  uint128: generateNumber(2e8),
  uint256: generateNumber(2e16),
  int256: generateSignedInteger(2e8),
  bool: generateFromOptions([true, false]),
  address: generateHexString(40),
  bytes: generateHexString(32),
  bytes1: generateHexString(2),
  bytes2: generateHexString(4),
  bytes3: generateHexString(6),
  bytes4: generateHexString(8),
  bytes8: generateHexString(16),
  bytes16: generateHexString(32),
  bytes32: generateHexString(64),
  string: generateFromOptions(['asdfadsf', 'hello world', 'test']),
  ['address[]']: generateHexStringArray(40, 1),
};

export function getKnownSolidityTypes(): string[] {
  return Object.keys(solidityTypes);
}

export function getSolidityParameter(type: string): any {
  ensure(solidityTypes[type], `Unknown type: ${type}`);
  return solidityTypes[type]();
}
