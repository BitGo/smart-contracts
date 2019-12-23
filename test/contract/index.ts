const expect = require('expect'); // tslint:disable-line
import * as fs from 'fs';
import { Contract } from '../../src';
import { ContractInstances } from '../../src/contract';
import { Parameter } from '../../src/contract/json';
import { MethodResponse } from '../../src/contract/method';
import { getKnownSolidityTypes, getSolidityParameter } from '../testutil';

const FUZZING_REPETITIONS = 5;

describe('Contract', () => {

  describe('Static ABIs', () => {

    let instanceConfig: { [key: string]: ContractInstances };

    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync('config/instances.json', 'utf-8'));
    });

    /**
     * Run `callback` on every contract that we have defined locally
     * @param callback Function with tests to run on each contract
     */
    const testStaticContracts = (callback: (contract: Contract, instanceName?: string) => void) => {
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

        for (let i = 0; i < FUZZING_REPETITIONS; i++) {
          const args: { [key: string]: any } = {};
          params.forEach((param: Parameter) => {
            args[param.name] = getSolidityParameter(param.type);
          });

          callback(contract.methods()[methodName](args));
        }
      });
    };

    it('Should fail to instantiate an unknown contract name', () => {
      const unknownContractName = 'FakeContractType';
      expect(() => new Contract(unknownContractName)).toThrow(`Unknown contract: ${unknownContractName}`);
    });


    testStaticContracts((contract: Contract) => {
      describe(`${contract.getName()}`, () => {
        const getRandomInstanceName = () => {
          const potentialInstances = instanceConfig[contract.getName()];
          const instanceIndex = Math.floor(Math.random() * Object.keys(potentialInstances).length);
          return Object.keys(potentialInstances)[instanceIndex];
        };

        it('Should instantiate correctly', () => {
          expect(contract).toBeDefined();
        });

        it('Should fail to instantiate an unknown instance name', () => {
          const unknownInstanceName = 'fakeinstance';
          expect(() => contract.instance(unknownInstanceName)).toThrow(`Unknown instance: ${unknownInstanceName}`);
        });


        it('Should fail when given no parameters to a function that requires them', () => {
          const allMethods = contract.listMethods();
          const methodsWithParameters = Object.keys(allMethods)
            .filter((methodName: string) => allMethods[methodName].inputs.length > 0);

          methodsWithParameters.forEach((methodName: string) => {
            expect(() => contract.methods()[methodName]({})).toThrow('Missing required parameter');
          });
        });

        it('Should succeed when given parameters to a function that doesnt require them', () => {
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

        it('Should succeed when given expected parameters', () => {
          testFuzzedContractMethods(contract, ({ data, amount, address }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toBeUndefined();
          });
        });

        it('Should succeed with custom address instances', () => {
          const instanceAddress = getSolidityParameter('address');
          contract = contract.address(instanceAddress);
          testFuzzedContractMethods(contract, ({ data, address, amount }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toEqual(instanceAddress);
          });
        });

        it('Should succeed with instances referenced by name', () => {
          const instanceName = getRandomInstanceName();
          const instanceAddress = instanceConfig[contract.getName()][instanceName];
          contract = contract.instance(instanceName);
          testFuzzedContractMethods(contract, ({ data, address, amount }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
            expect(address).toEqual(instanceAddress);
          });
        });
      });
    });
  });
});
