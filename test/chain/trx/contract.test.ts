const expect = require('expect'); // tslint:disable-line
import * as fs from 'fs';
import { Contract } from '../../../src/base/contracts/contracts';
import { MethodDefinition } from '../../../src/base/methods/methods';
import { ContractInstance } from '../../../src/base/contracts/contractInstances';
import { TrxMethodDefinition } from '../../../src/trx/methods/methods';
import { getContractsFactory } from '../../../src';
import { getKnownSolidityTypes, getSolidityParameter, testFuzzedContractMethods } from '../../testutil';


describe('TRX Contracts', () => {
  const chainName = 'trx';
  const trxContractFactory = getContractsFactory(chainName);

  const testStaticContracts = (callback: (contract: Contract<any>, instanceName?: string) => void) => {
    trxContractFactory.listContractTypes().forEach((abiFileName) => {
      callback(trxContractFactory.getContract(abiFileName));
    });
  };


  describe('Test Trx Contracts ABIs', () => {
    let instanceConfig: { [key: string]: ContractInstance };

    before(() => {
      instanceConfig = JSON.parse(fs.readFileSync('trx/config/instances.json', 'utf-8'));
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

        it('Should fail when given no parameters to a function that requires them', () => {
          // Since methods can overload each other we have to double check that it actually has only no params
          const methodsWithoutParameters: Set<string> = new Set();
          const methodsWithParameters: MethodDefinition[] = contract.listMethods()
              .filter((method: MethodDefinition) => {
                // TODO: Fix returned MethodDefinition type for each chain (https://bitgoinc.atlassian.net/browse/STLX-1617)
                const castedMethod = method as TrxMethodDefinition;
                const noParams = castedMethod.inputs!.length === 0;
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
            testFuzzedContractMethods(chainName, contract, ({ data }) => {
              expect(data).toBeDefined();
            }, { instanceName });
          }
        });

      });
    });
  });

});
