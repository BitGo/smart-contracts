import * as assert from 'assert';

const uintOptions = [1, 2, 3, 4, 5, 10000, 123400, 9913214];

const solidityTypes = {
  uint: uintOptions,
  uint8: uintOptions,
  uint16: uintOptions,
  uint32: uintOptions,
  uint64: uintOptions,
  uint128: uintOptions,
  uint256: uintOptions,
  bool: [true, false],
  address: ['0xcab3568468b322c265a77f8effed45b3091f4cca', '0x923c90b98ee834d118c85ddf44906ee1769df648',
    '0x923c90b98ee834d118c85ddf44906ee1769df648', '0xcab3568468b322c265a77f8effed45b3091f4cca'],
  byte: ['0x00'],
  byte1: ['0x00'],
  byte2: ['0x0000'],
  byte3: ['0x000000'],
  byte4: ['0x00000000'],
  byte8: ['0x0000000000000000'],
  byte16: ['0x00000000000000000000000000000000'],
  byte32: ['0x0000000000000000000000000000000000000000000000000000000000000000'],
  string: ['asdfadsf', 'hello world', 'test'],
};

export function getKnownSolidityTypes(): string[] {
  return Object.keys(solidityTypes);
}

export function getSolidityParameter(type: string): any {
  assert(solidityTypes[type], `Unknown type: ${type}`);
  const potentialResponses = solidityTypes[type];
  return potentialResponses[Math.floor(Math.random() * potentialResponses.length)];
}
