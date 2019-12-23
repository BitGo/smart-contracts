import { ensure } from '../src/util/ensure';

const generateInteger = (max: number) => {
  return () => {
    return Math.floor(Math.random() * max);
  };
};

const generateHexString = (length: number): () => string => {
  return () => {
    ensure(length % 2 === 0, `Invalid hex length: ${length}`);
    let result = '0x';
    for (let i = 0; i < length / 2; i++) {
      const byte = generateInteger(256)();
      result += byte.toString(16);
    }
    return result;
  };
};

const generateFromOptions = (options: any[]) => {
  return () => {
    return options[generateInteger(options.length)()];
  };
};

const solidityTypes: { [key: string]: any } = {
  uint: generateInteger(2e8),
  uint8: generateInteger(2e8),
  uint16: generateInteger(2e8),
  uint32: generateInteger(2e8),
  uint64: generateInteger(2e8),
  uint128: generateInteger(2e8),
  uint256: generateInteger(2e8),
  bool: generateFromOptions([true, false]),
  address: generateHexString(40),
  byte: generateHexString(2),
  byte1: generateHexString(2),
  byte2: generateHexString(4),
  byte3: generateHexString(6),
  byte4: generateHexString(8),
  byte8: generateHexString(16),
  byte16: generateHexString(32),
  byte32: generateHexString(64),
  string: generateFromOptions(['asdfadsf', 'hello world', 'test']),
};

export function getKnownSolidityTypes(): string[] {
  return Object.keys(solidityTypes);
}

export function getSolidityParameter(type: string): any {
  ensure(solidityTypes[type], `Unknown type: ${type}`);
  return solidityTypes[type]();
}
