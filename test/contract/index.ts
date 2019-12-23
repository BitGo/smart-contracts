import * as expect from 'expect';
import * as fs from 'fs';
import { Contract } from '../../';
import { Parameter } from '../../contract/json';
import { MethodResponse } from '../../contract/method';
import { getKnownSolidityTypes, getSolidityParameter } from '../testutil';

const FUZZING_REPETITIONS = 5;

describe('Contract', () => {
  describe('Static ABIs', () => {
    let instanceConfig;

    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync('config/instances.json', 'utf-8'));
    });

    /**
     * Run `callback` on every contract that we have defined locally
     * @param callback Function with tests to run on each contract
     */
    const testStaticContracts = (callback: (contract: Contract, instanceName?: string) => void) => {
      Contract.listContractTypes().forEach((abiFileName) => {
        if (instanceConfig[abiFileName]) {
          const abiConfig = instanceConfig[abiFileName];
          const instanceNames = Object.keys(abiConfig);
          const instanceName = instanceNames[Math.floor(Math.random() * instanceNames.length)];
          callback(new Contract(abiFileName), instanceName);
        } else {
          callback(new Contract(abiFileName));
        }
      });
    };

    /**
     * Test every method on the given contract, using fuzzed inputs.
     * Runs tests provided in `callback` on the responses from each fuzzed method
     * @param contract the contract to run methods from
     * @param callback Callback to run on the response from calling each method with fuzzed inputs
     */
    const testFuzzedContractMethods = (contract: Contract, callback: (response: MethodResponse) => void) => {
      const allMethods = contract.listMethods();

      Object.keys(allMethods).forEach((methodName: string) => {
        const params: Parameter[] = allMethods[methodName].inputs;
        const args = {};

        params.forEach((param: Parameter) => {
          args[param.name] = getSolidityParameter(param.type);
        });

        callback(contract.methods()[methodName](args));
      });
    };

    it('Should instantiate correctly', () => {
      testStaticContracts((contract) => {
        expect(contract).toBeDefined();
      });
    });

    it('Should fail when given parameters to a function that requires them', () => {
      testStaticContracts((contract) => {
        const allMethods = contract.listMethods();
        const methodsWithParameters = Object.keys(allMethods)
          .filter((methodName: string) => allMethods[methodName].inputs.length > 0);

        methodsWithParameters.forEach((methodName: string) => {
          expect(() => contract.methods()[methodName]({})).toThrow('Missing required parameter');
        });
      });
    });

    it('Should succeed when given parameters to a function that doesnt require them', () => {
      testStaticContracts((contract) => {
        const allMethods = contract.listMethods();
        const methodsWithoutParameters = Object.keys(allMethods)
          .filter((methodName: string) => allMethods[methodName].inputs.length === 0);

        methodsWithoutParameters.forEach((methodName: string) => {
          getKnownSolidityTypes().forEach((type) => {
            const { data } = contract.methods()[methodName]({ unexpectedParam: getSolidityParameter(type) });
            expect(data).toBeDefined();
          });
        });
      });
    });

    it('Should succeed when given expected parameters', () => {
      for (let i = 0; i < FUZZING_REPETITIONS; i++) {
        testStaticContracts((contract) => {
          testFuzzedContractMethods(contract, ({ data, amount, address }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toBeUndefined();
          });
        });
      }
    });

    it('Should succeed with custom address instances', () => {
      for (let i = 0; i < FUZZING_REPETITIONS; i++) {
        testStaticContracts((contract) => {
          const instanceAddress = getSolidityParameter('address');
          contract = contract.address(instanceAddress);
          testFuzzedContractMethods(contract, ({ data, address, amount }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toEqual(instanceAddress);
          });
        });
      }
    });

    it('Should succeed with instances referenced by name', () => {
      for (let i = 0; i < FUZZING_REPETITIONS; i++) {
        testStaticContracts((contract, instanceName) => {
          const instanceAddress = instanceConfig[contract.getName()][instanceName];
          contract = contract.instance(instanceName);
          testFuzzedContractMethods(contract, ({ data, address, amount }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toEqual(instanceAddress);
          });
        });
      }
    });
  });
});
