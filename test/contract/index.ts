import * as expect from 'expect';
import { Contract } from '../../';
import { Parameter } from '../../contract/json';
import { MethodResponse } from '../../contract/method';
import { getKnownSolidityTypes, getSolidityParameter } from '../testutil';

const FUZZING_REPETITIONS = 10;

describe('Contract', () => {
  describe('Static ABIs', () => {
    /**
     * Run `callback` on every contract that we have defined locally
     * @param callback Function with tests to run on each contract
     */
    const testStaticContracts = (callback: (contract: Contract) => void) => {
      Contract.listContractTypes().forEach((abiFileName) => {
        callback(new Contract(abiFileName));
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

        callback(contract.methods[methodName](args));
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
          expect(() => contract.methods[methodName]({})).toThrow('Missing required parameter');
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
            const { data } = contract.methods[methodName]({ unexpectedParam: getSolidityParameter(type) });
            expect(data).toBeDefined();
          });
        });
      });
    });

    it('Should succeed when given expected parameters', () => {
      for (let i = 0; i < FUZZING_REPETITIONS; i++) {
        testStaticContracts((contract) => {
          testFuzzedContractMethods(contract, ({ data }) => {
            expect(data).toBeDefined();
          });
        });
      }
    });
  });
});
