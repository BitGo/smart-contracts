import { methodID, rawDecode } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import * as fs from 'fs';
import * as path from 'path';

import { formatValue } from './types';
import { Contract } from '../contract';
import { ContractABI, MethodABI, Parameter } from '../contract/json';
import { ensure } from '../util/ensure';
import { isValidJSON } from '../util/json';

/**
 * A class to decode contract calls and explain their purpose
 */
export class Decoder {

  /**
   * Read in and parse all methods from all defined contract abis
   * @return A mapping of method IDs (in hex string format) to the method ID object
   */
  private static loadMethods(): MethodIdMapping {
    const result: MethodIdMapping = {};

    for (const contractName of Contract.listContractTypes()) {
      const abi = fs.readFileSync(path.join( __dirname, `${Contract.ABI_DIR}/${contractName}.json`), 'utf-8');
      ensure(isValidJSON(abi), `Invalid JSON: ${abi}`);
      const jsonAbi: ContractABI = JSON.parse(abi);

      for (const methodAbi of jsonAbi) {
        if (methodAbi.inputs) {
          const name = methodAbi.name;
          const types = methodAbi.inputs.map((input) => input.type);
          const methodIdString = bufferToHex(methodID(name, types));

          result[methodIdString] = { contractName, abi: methodAbi };
        }
      }

    }

    return result;
  }

  /**
   * Maps 8-byte method IDs to the ABI of the method that they represent
   */
  private readonly methodsById: MethodIdMapping;

  constructor() {
    this.methodsById = Decoder.loadMethods();
  }

  /**
   * Decode the given function call data, returning a readable explanation of the call
   * @param data The data to decode
   * @return An explanation of the call, including the function name and arguments passed
   */
  public decode(data: Buffer): FunctionCallExplanation {
    const methodId = bufferToHex(data.slice(0, 4));
    const abiEncodedArguments = data.slice(4);
    ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);

    const { contractName, abi: { name, inputs } } = this.methodsById[methodId];
    const types = inputs.map((input) => input.type);
    const decodedArguments = rawDecode(types, abiEncodedArguments);

    const args: FunctionArgument[] = [];
    for (let i = 0; i < inputs.length; i++) {
      const { name, type } = inputs[i];
      const decodedArgument = decodedArguments[i];
      args.push({ name, type, value: formatValue(decodedArgument, type) });
    }

    return {
      methodId,
      name,
      args,
      contractName,
    };
  }
}

interface MethodData {
  abi: MethodABI;
  contractName: string;
}

interface MethodIdMapping {
    [key: string]: MethodData;
}

interface FunctionArgument extends Parameter {
    value: any;
}

export interface FunctionCallExplanation {
    methodId: string;
    contractName: string;
    name: string;
    args: FunctionArgument[];
}
