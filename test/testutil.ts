import { ensure } from '../src/util/ensure';
import BigNumber from 'bignumber.js';
import { Contract } from '../src/base/contracts/contracts';
import { Parameter, MethodResponse } from '../src/base/methods/methods';
const tronweb = require('tronweb');

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

const generateTrxAddress = () => {
  return () => {
    return tronweb.utils.accounts.generateAccount().address.base58;
  };
};

const generateTrxHexString = (length: number): () => string => {
  return () => {
    ensure(length % 2 === 0, `Invalid hex length: ${length}`);
    let result = '0x';
    for (let i = 0; i < length / 2; i++) {
      const byte = new BigNumber(generateNumber(256)());
      result += tronweb.utils.bytes.byte2hexStr(byte.toNumber());
    }
    return result;
  };
};

const generateEthAddress = () => {
  return () => {
    return '0x61E64B5224f88944222c4Aa7CCE1809c17106De5';
  };
};

const generateIntArrray = (arr:string[]) => {
  return () => {
    return arr;
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
    address: generateEthAddress(),
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
    ['uint8[]']: generateIntArrray([generateNumber(2e2)(), generateNumber(2e2)()]),
    ['uint256[]']: generateIntArrray([generateNumber(2e16)(), generateNumber(2e8)()]),
    ['bytes[]']: generateHexStringArray(40, 1),
    uint24: generateNumber(2e4),
    uint160: generateNumber(2e8),
    int24: generateNumber(2e4),
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
    address: generateTrxAddress(), // generate valid tron address
    bytes32: generateTrxHexString(64),
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
      let args: { [key: string]: any } = {};
      params.forEach((param: Parameter) => {
        if (param.type === 'tuple') {
          const obj :{[key: string]: any} = {};
          param.components.forEach((key:{name: string, type: string}) => {
            obj[key.name] = getSolidityParameter(chainName, key.type);
          });
          args = obj;
        } else {
          args[param.name] = getSolidityParameter(chainName, param.type);
        }
       
      });
      const contractInstance = contract.instance(args.instanceName || 'default');

      if (args.address) {
        contractInstance.address = args.address;
      }
      
      callback(contractInstance.methods()[name].call(args));
    }
  });
}

