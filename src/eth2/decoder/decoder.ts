import { methodID, rawDecode } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import { Decoder, FunctionCallExplanation } from '../../base2/decoder/decoder';
import { formatValue } from './types';
import { ensure } from '../../util/ensure';
import { EthMethod } from '../methods/methods';
import { listContractTypes } from '../../base2/contracts/contractInstances';
import { EthContract } from '../contracts/contracts';

import * as fs from 'fs';
import * as path from 'path';
import { isValidJSON } from '../../util/json';


export interface MethodData {
  abi: EthMethod;
  contractName: string;
}

export interface MethodIdMapping {
  [key: string]: MethodData;
}


export class EthDecoder implements Decoder<FunctionCallExplanation> {
  private loadMethods(): MethodIdMapping {
    const result: MethodIdMapping = {};

    for (const contractName of listContractTypes(EthContract.ABI_DIR)) {
      const abi = fs.readFileSync(path.join( __dirname, `${EthContract.ABI_DIR}/${contractName}.json`), 'utf-8');
      ensure(isValidJSON(abi), `Invalid JSON: ${abi}`);
      const jsonAbi = JSON.parse(abi);

      for (const methodAbi of jsonAbi) {
        if (methodAbi.inputs) {
          const name = methodAbi.name;
          const types = methodAbi.inputs.map((input: { type: any; }) => input.type);
          const methodIdString = bufferToHex(methodID(name, types));

          result[methodIdString] = { contractName, abi: methodAbi };
        }
      }

    }

    return result;

  }

  constructor() {
    this.methodsById = this.loadMethods();
  }
  
  protected readonly methodsById: MethodIdMapping;


  public decode(data: Buffer): FunctionCallExplanation {
    // get the method id and @arguments 
    const methodId = bufferToHex(data.slice(0, 4)); // GOT methodId
    const abiEncodedArguments = data.slice(4);
    ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);

    // get contract name , name and inputs
    const { contractName, abi: { name, inputs } } = this.methodsById[methodId]; // GOT contractname and name
    const types = inputs.map((input) => input.type);

    // get decode @arguments
    const decodedArguments = rawDecode(types, abiEncodedArguments);

    // build and parse @arguments
    const args = [];
    for (let i = 0; i < inputs.length; i++) {
      const { name, type } = inputs[i];
      const decodedArgument = decodedArguments[i];
      args.push({ name, type, value: formatValue(decodedArgument, type) });
    } // GOT args

    return {
      methodId,
      name,
      args,
      contractName,
    };
  }

}

