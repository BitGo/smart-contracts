const expect = require('expect'); // tslint:disable-line
import * as fs from 'fs';
import { Contract } from '../../../src/base/contracts/contracts';
import { MethodDefinition } from '../../../src/base/methods/methods';
import { EthContract } from '../../../src/eth/contracts/contracts';
import { EthMethodDefinition } from '../../../src/eth/methods/methods';
import { ContractInstance } from '../../../src/base/contracts/contractInstances';
import { getContractsFactory } from '../../../src';
import { getKnownSolidityTypes, getSolidityParameter, testFuzzedContractMethods } from '../../testutil';

describe('Contract', () => {
  const chainName = 'eth';
  const ethContracts = getContractsFactory(chainName);

  describe('Test Contracts ABIs', () => {

    let instanceConfig: { [key: string]: ContractInstance };

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
          const methodsWithParameters: MethodDefinition[] = contract.listMethods()
            .filter((method: MethodDefinition) => {
              // TODO(STLX-1617): Fix returned MethodDefinition type for each chain
              const castedMethod = method as EthMethodDefinition;
              const noParams = castedMethod.inputs.length === 0;
              if (noParams) {
                methodsWithoutParameters.add(castedMethod.name);
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
            getKnownSolidityTypes(chainName).forEach((type) => {
              const { data } = contract.instance().methods()[method.name].call({ unexpectedParam: getSolidityParameter(chainName, type) });
              expect(data).toBeDefined();
            });
          });
        });

        it('Should succeed when given expected parameters', () => {
          testFuzzedContractMethods(chainName, contract, ({ data }) => {
            expect(data).toBeDefined();
          });
        });

        it('Should succeed with custom address instances', () => {
          const instanceAddress = getSolidityParameter(chainName, 'address');
          testFuzzedContractMethods(chainName, contract, ({ data }) => {
            expect(data).toBeDefined();
          }, { address: instanceAddress });
        });

        it('Should succeed with instances referenced by name', () => {
          const instanceName = getRandomInstanceName();
          if (instanceName) {
            // const instanceAddress = instanceConfig[contract.name][instanceName];
            testFuzzedContractMethods(chainName, contract, ({ data }) => {
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
        expect(contractInstance).toHaveProperty('contractReader');
        expect(contractInstance).toHaveProperty('contractInstances');
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
