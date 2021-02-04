const expect = require('expect'); // tslint:disable-line
import * as fs from 'fs';
import { Contract } from '../../../src/base/contracts/contracts';
import { Parameter, MethodDefinition, MethodResponse } from '../../../src/base/methods/methods';
import { EthContract } from '../../../src/eth/contracts/contracts';
import { ContractInstances } from '../../../src/base/contracts/contractInstances';
import { getContractsFactory } from '../../../src';

// import { EthMethodABI, Parameter } from '../../../src/base/iface';
import { getKnownSolidityTypes, getSolidityParameter } from '../../testutil';

const FUZZING_REPETITIONS = 5;

describe('Contract', () => {
  const chainName = 'eth';
  const ethContracts = getContractsFactory(chainName);

  describe('Test Contracts ABIs', () => {

    let instanceConfig: { [key: string]: ContractInstances };

    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync('eth/config/instances.json', 'utf-8'));
    });

    /**
     * Run `callback` on every contract that we have defined locally
     * @param callback Function with tests to run on each contract
     */
    const testStaticContracts = (callback: (contract: Contract<any>, instanceName?: string) => void) => {
      ethContracts.listContractTypes().forEach((abiFileName) => {
        callback(ethContracts.getContract(abiFileName));
      });
    };

    /**
     * Test every method on the given contract, using fuzzed inputs.
     * Runs tests provided in `callback` on the responses from each fuzzed method
     * @param contract the contract to run methods from
     * @param callback Callback to run on the response from calling each method with fuzzed inputs
     */
    const testFuzzedContractMethods = (contract: Contract<any>, callback: (response: MethodResponse) => void, args?: any) => {
      const allMethods = contract.listMethods();
      // TODO: Fix MethodDefinition generic for each chain (https://bitgoinc.atlassian.net/browse/STLX-1617)
      allMethods.forEach((methodDefinition: any) => {
        const params = methodDefinition.inputs;
        const name = methodDefinition.name;

        for (let i = 0; i < FUZZING_REPETITIONS; i++) {
          const args: { [key: string]: any } = {};
          params.forEach((param: Parameter) => {
            args[param.name] = getSolidityParameter(param.type);
          });
          const contractInstance = contract.instance(args.instanceName || 'default');

          if (args.address) {
            contractInstance.address = args.address;
          }

          callback(contractInstance.methods()[name].call(args));
        }
      });
    };

    it('Should fail to instantiate an unknown contract name', () => {
      const unknownContractName = 'FakeContractType';
      expect(() => new EthContract(unknownContractName)).toThrow(`Unknown contract: ${unknownContractName}`);
    });


    testStaticContracts((contract: Contract<any>) => {
      describe(`${contract.name}`, () => {
        const getRandomInstanceName = () => {
          const potentialInstances = instanceConfig[contract.name];
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
          // TODO: Fix MethodDefinition generic for each chain (https://bitgoinc.atlassian.net/browse/STLX-1617)
          const methodsWithParameters: MethodDefinition[] = contract.listMethods()
            .filter((method: any) => {
              const noParams = method.inputs.length === 0;
              if (noParams) {
                methodsWithoutParameters.add(method.name);
              }
              return !noParams;
            })
            .filter((method: MethodDefinition) => !methodsWithoutParameters.has(method.name));

          methodsWithParameters.forEach((method: MethodDefinition) => {
            expect(() => contract.instance().methods()[method.name].call({})).toThrow('Missing required parameter');
          });
        });

        it('Should succeed when given parameters to a function that doesnt require them', () => {
          const methodsWithoutParameters = contract.listMethods()
            .filter((method: any) => method.inputs.length === 0);

          methodsWithoutParameters.forEach((method: MethodDefinition) => {
            getKnownSolidityTypes().forEach((type) => {
              const { data } = contract.instance().methods()[method.name].call({ unexpectedParam: getSolidityParameter(type) });
              expect(data).toBeDefined();
            });
          });
        });

        it('Should succeed when given expected parameters', () => {
          testFuzzedContractMethods(contract, ({ data }) => {
            expect(data).toBeDefined();
          });
        });

        it('Should succeed with custom address instances', () => {
          const instanceAddress = getSolidityParameter('address');
          testFuzzedContractMethods(contract, ({ data }) => {
            expect(data).toBeDefined();
          }, { address: instanceAddress });
        });

        it('Should succeed with instances referenced by name', () => {
          const instanceName = getRandomInstanceName();
          if (instanceName) {
            // const instanceAddress = instanceConfig[contract.name][instanceName];
            testFuzzedContractMethods(contract, ({ data }) => {
              expect(data).toBeDefined();
            }, { instanceName });
          }
        });
      });
    });
  });
  describe('Eth Contracts using factory method', () => {
    let supportedEthContracts: string[];

    before(() => {
      supportedEthContracts = ethContracts.listContractTypes();
    });

    it('Should create a valid contract instance for each supported eth contract', () => {
      supportedEthContracts.forEach(contract => {
        const contractInstance = ethContracts.getContract(contract);
        expect(contractInstance).toHaveProperty('name');
        expect(contractInstance).toHaveProperty('_contractReader');
        expect(contractInstance).toHaveProperty('_contractInstances');
        expect(contractInstance.name).toEqual(contract);
      });
    });

    it('Should fail to create a unknown token instance', () => {
      const contractName = 'StandardERC20';
      const tokenName = 'invalid';
      expect(() => ethContracts.getContract(contractName).instance(tokenName)).toThrowError(`Unknown instance: ${tokenName}`);
    });

    it('Should exists a default instance for each eth contract type', () => {
      ethContracts.listContractTypes().forEach((contractName) => {
        const contractInstance = ethContracts.getContract(contractName).instance();
        expect(contractInstance).toHaveProperty('name');
        expect(contractInstance).toHaveProperty('address');
        expect(contractInstance.name).toEqual('default');
      });
    });

    it('Should call successfully an existing method in a contract', () => {
      const contractName = 'StandardERC20';
      const tokenName = 'DAI';
      const recipient = '0xadd62287c10d90f65fd3bf8bf94183df115c030a';
      const tokenAmount = 1e18; // 1 DAI
      const daiContract = ethContracts.getContract(contractName).instance(tokenName);
      const callMethodResponse = daiContract.methods().approve.call({ _spender: recipient, _value: tokenAmount.toString(10) });
      expect(daiContract).toHaveProperty('address');
      expect(callMethodResponse).toHaveProperty('data');
      expect(callMethodResponse).toHaveProperty('amount');
    });

  });
});
