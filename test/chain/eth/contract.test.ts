const expect = require('expect'); // tslint:disable-line
import * as fs from 'fs';
import { Contract, MethodResponse } from '../../../src/eth/contract/contract';
import { ContractInstances } from '../../../src/base/contracts/baseContract';
import { getContractsFactory } from '../../../src';

import { EthMethodABI, Parameter } from '../../../src/base/iface';
import { getKnownSolidityTypes, getSolidityParameter } from '../../testutil';

const FUZZING_REPETITIONS = 5;

describe('Contract', () => {
  const chainName = 'eth';

  describe('Static ABIs', () => {

    let instanceConfig: { [key: string]: ContractInstances };

    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync('eth/config/instances.json', 'utf-8'));
    });

    /**
     * Run `callback` on every contract that we have defined locally
     * @param callback Function with tests to run on each contract
     */
    const testStaticContracts = (callback: (contract: Contract, instanceName?: string) => void) => {
      Contract.listContractTypes(Contract.ABI_DIR).forEach((abiFileName) => {
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

      allMethods.forEach((methodDefinition: EthMethodABI) => {
        const params = methodDefinition.inputs;
        const name = methodDefinition.name;

        for (let i = 0; i < FUZZING_REPETITIONS; i++) {
          const args: { [key: string]: any } = {};
          params.forEach((param: Parameter) => {
            args[param.name] = getSolidityParameter(param.type);
          });

          callback(contract.methods()[name].call(args));
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
          // Since methods can overload each other we have to double check that it actually has only no params
          const methodsWithoutParameters: Set<string> = new Set();
          const methodsWithParameters: EthMethodABI[] = contract.listMethods()
            .filter((method: EthMethodABI) => {
              const noParams = method.inputs.length === 0;
              if (noParams) {
                methodsWithoutParameters.add(method.name);
              }
              return !noParams;
            })
            .filter((method: EthMethodABI) => !methodsWithoutParameters.has(method.name));

          methodsWithParameters.forEach((method: EthMethodABI) => {
            expect(() => contract.methods()[method.name].call({})).toThrow('Missing required parameter');
          });
        });

        it('Should succeed when given parameters to a function that doesnt require them', () => {
          const methodsWithoutParameters = contract.listMethods()
            .filter((method: EthMethodABI) => method.inputs.length === 0);

          methodsWithoutParameters.forEach((method: EthMethodABI) => {
            getKnownSolidityTypes().forEach((type) => {
              const { data } = contract.methods()[method.name].call({ unexpectedParam: getSolidityParameter(type) });
              expect(data).toBeDefined();
            });
          });
        });

        it('Should succeed when given expected parameters', () => {
          testFuzzedContractMethods(contract, ({ data, amount }) => {
            expect(data).toBeDefined();
            expect(amount).toBeDefined();
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
          if (instanceName) {
            const instanceAddress = instanceConfig[contract.getName()][instanceName];
            contract = contract.instance(instanceName);
            testFuzzedContractMethods(contract, ({ data, address, amount }) => {
              expect(data).toBeDefined();
              expect(amount).toBeDefined();
              expect(address).toEqual(instanceAddress);
            });
          }
        });
      });
    });
  });

  describe('Eth Contracts using factory method', () => {
    let instanceConfig: { [key: string]: ContractInstances };
    let supportedEthContracts: string[];
    const ethFactory = getContractsFactory(chainName);
    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync(`${chainName}/config/instances.json`, 'utf-8'));
      supportedEthContracts = Contract.listContractTypes(Contract.ABI_DIR);
    });


    it('Should create a valid contract instance for each supported eth contract', () => {
      supportedEthContracts.forEach(contract => {
        const contractInstance = ethFactory.getContract(contract);
        expect(contractInstance).toHaveProperty('contractInstances');
        expect(contractInstance).toHaveProperty('methodDefinitions');
        expect(contractInstance.contractName).toEqual(contract);
      });
    });


    it('Should create a valid contract instance of a supported eth contract', () => {
      const contractName = 'StandardERC20';
      const contract = ethFactory.getContract(contractName);
      expect(contract.contractName).toEqual(contractName);
      expect(contract).toHaveProperty('contractName');
      expect(contract).toHaveProperty('contractInstances');
      expect(contract).toHaveProperty('methodDefinitions');
      const staticContractInstances = Object.keys(instanceConfig[contractName]);
      // check eth contract instances are valid
      const isValidContractInstance = Object.keys(contract.contractInstances).every(
        (key, index) => {
          return key === staticContractInstances[index].toLowerCase();
        });
      expect(isValidContractInstance).toEqual(true);
    });

    it('Should fail to create a unknown token instance', () => {
      const contractName = 'StandardERC20';
      const tokenName = 'invalid';
      expect(() => ethFactory.getContract(contractName).instance(tokenName)).toThrowError(`Unknown instance: ${tokenName}`);
    });

    it('Should call successfully an existing method in a contract', () => {
      const contractName = 'StandardERC20';
      const tokenName = 'DAI';
      const recipient = '0xadd62287c10d90f65fd3bf8bf94183df115c030a';
      const tokenAmount = 1e18; // 1 DAI
      const daiContract = ethFactory.getContract(contractName).instance(tokenName);
      const callMethodResponse = daiContract.methods().approve.call({ _spender: recipient, _value: tokenAmount.toString(10) });
      expect(callMethodResponse).toHaveProperty('data');
      expect(callMethodResponse).toHaveProperty('amount');
      expect(callMethodResponse).toHaveProperty('address');
    });

  });
});
