import { methodID } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import { Decoder, FunctionCallExplanation } from '../../base/decoder/decoder';
import { formatValue } from './types';
import { ensure } from '../../util/ensure';
import { TrxMethod } from '../methods/methods';
import { getAbiContract, listContractTypes } from '../../base/contracts/contractInstances';
import { TrxContract } from '../contracts/contracts';
import { parseToBuffer } from '../../../src/util/string';
// TronWeb does not use ES Modules so we must use require
const TronWeb = require('tronweb');


export interface MethodData {
  abi: TrxMethod;
  contractName: string;
}

export interface MethodIdMapping {
  [key: string]: MethodData;
}


export class TrxDecoder implements Decoder<FunctionCallExplanation> {
  private loadMethods(): MethodIdMapping {
    const result: MethodIdMapping = {};

    for (const contractName of listContractTypes(TrxContract.chainName)) {
      const jsonTronAbi = getAbiContract(contractName, TrxContract.chainName, TrxContract.ACCESS_ABI_VALUES);

      for (const methodAbi of jsonTronAbi) {
        if (methodAbi.type === 'Function') {
          const name = methodAbi.name;
          methodAbi.inputs = methodAbi.inputs ? methodAbi.inputs : [];
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


  public decode(data: Buffer | string ): FunctionCallExplanation {
    if (typeof data === 'string') {
      data = parseToBuffer(data);
    }
    const methodId = bufferToHex(data.slice(0, 4));
    ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);

    const { contractName, abi: { name, inputs } } = this.methodsById[methodId];
    const names = inputs.map(({ name }) => name).filter(name => !!name);
    const types = inputs.map(({ type }) => type);

    const abiEncodedArgs = bufferToHex(data);
    const decodedArguments = TronWeb.utils.abi.decodeParams(names, types, abiEncodedArgs, true);

    const args: any[] = [];
    for (let i = 0; i < inputs.length; i++) {
      const { name, type } = inputs[i];
      const decodedArgument = decodedArguments[name];
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

