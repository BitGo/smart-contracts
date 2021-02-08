import { ensure } from '../src/util/ensure';
import BigNumber from 'bignumber.js';
import { Contract } from '../src/base/contracts/contracts';
import { Parameter, MethodResponse } from '../src/base/methods/methods';
const tronweb = require('tronweb');
const keccak256 = require('keccak256');

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
  eth: {
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
  },
  trx: {
    uint: generateNumber(2e8),
    uint8: generateNumber(2e2),
    uint16: generateNumber(2e4),
    uint32: generateNumber(2e8),
    uint64: generateNumber(2e8),
    uint128: generateNumber(2e8),
    uint256: generateNumber(2e16),
    int256: generateSignedInteger(2e8),
    bool: generateFromOptions([true, false]),
    address: () => tronweb.utils.accounts.generateAccount().address.base58, // generate valid tron address
    bytes32: () => `0x${keccak256().toString('hex')}`, // generate valid bytes32 hash
    string: generateFromOptions(['asdfadsf', 'hello world', 'test']),
  },
};

export function getKnownSolidityTypes(chainName: string): string[] {
  return Object.keys(solidityTypes[chainName]);
}

export function getSolidityParameter(chainName: string, type: string): any {
  ensure(solidityTypes[chainName][type], `Unknown type: ${type}`);
  return solidityTypes[chainName][type]();
}

export function testFuzzedContractMethods (chainName:string, contract: Contract<any>, callback: (response: MethodResponse) => void, args?: any) {
  const allMethods = contract.listMethods();
  const FUZZING_REPETITIONS = 5;
  allMethods.forEach((methodDefinition: any) => {
    const params = methodDefinition.inputs;
    const name = methodDefinition.name;

    for (let i = 0; i < FUZZING_REPETITIONS; i++) {
      const args: { [key: string]: any } = {};
      params.forEach((param: Parameter) => {
        args[param.name] = getSolidityParameter(chainName, param.type);
      });
      const contractInstance = contract.instance(args.instanceName || 'default');

      if (args.address) {
        contractInstance.address = args.address;
      }

      callback(contractInstance.methods()[name].call(args));
    }
  });
}

