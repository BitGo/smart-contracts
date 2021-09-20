import { methodID, rawDecode } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import { Decoder, FunctionCallExplanation } from '../../base/decoder/decoder';
import { formatValue } from './types';
import { ensure } from '../../util/ensure';
import { EthMethod } from '../methods/methods';
import { listContractTypes, contracts } from '../../base/contracts/contractInstances';
import { EthContract } from '../contracts/contracts';
import { parseToBuffer } from '../../../src/util/string';

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

    for (const contractName of listContractTypes(EthContract.chainName)) {
      const abi = contracts[EthContract.chainName][contractName];

      for (const methodAbi of abi) {
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

  public decode(data: Buffer | string): FunctionCallExplanation {
    if (typeof data === 'string') {
      data = parseToBuffer(data);
    }
    
    const methodId = bufferToHex(data.slice(0, 4));
    const abiEncodedArguments = data.slice(4);
    ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);

    const { contractName, abi: { name, inputs } } = this.methodsById[methodId];
    const types = inputs.map((input) => input.type);

    const decodedArguments = rawDecode(types, abiEncodedArguments);

    const args: any[] = [];
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

