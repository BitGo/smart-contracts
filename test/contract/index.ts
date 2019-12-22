import * as expect from 'expect';
import * as fs from 'fs';
import { Contract } from '../../';
import { isValidJSON } from '../../util/json';
import { getKnownSolidityTypes, getSolidityParameter } from '../testutil';
import { Parameter } from '../../contract/json';

const CONTRACT_DIR = 'abis/';

describe('Contract', () => {
  describe('Static ABIs', () => {
    it('ABIs should be a valid JSON ABI', () => {
      Contract.listContractTypes().forEach((abiFileName) => {
        const jsonAbi: string = fs.readFileSync(CONTRACT_DIR + abiFileName + '.json', 'utf-8');
        expect(isValidJSON(jsonAbi)).toBe(true);
      });
    });

    it('Should instantiate correctly', () => {
      Contract.listContractTypes().forEach((abiFileName) => {
        const contract = new Contract(abiFileName);
      });
    });

    it('Should fail when given parameters to a function that requires them', () => {
      Contract.listContractTypes().forEach((abiFileName) => {
        const contract = new Contract(abiFileName);
        const allMethods = contract.listMethods();
        const methodsWithParameters = Object.keys(allMethods)
          .filter((methodName: string) => allMethods[methodName].inputs.length > 0);

        methodsWithParameters.forEach((methodName: string) => {
          expect(() => contract.methods[methodName]({})).toThrow('Missing required parameter');
        });
      });
    });

    it('Should succeed when given parameters to a function that doesnt require them', () => {
      Contract.listContractTypes().forEach((abiFileName) => {
        const contract = new Contract(abiFileName);
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
      Contract.listContractTypes().forEach((abiFileName) => {
        const contract = new Contract(abiFileName);
        const allMethods = contract.listMethods();

        Object.keys(allMethods).forEach((methodName: string) => {
          const params: Parameter[] = allMethods[methodName].inputs;
          const args = {};

          params.forEach((param: Parameter) => {
            args[param.name] = getSolidityParameter(param.type);
          });

          const { data } = contract.methods[methodName](args);
          expect(data).toBeDefined();
        });
      });
    });
  });
});
