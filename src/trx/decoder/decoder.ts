import { methodID } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import { Decoder, FunctionCallExplanation } from '../../base/decoder/decoder';
import { formatValue } from './types';
import { ensure } from '../../util/ensure';
import { TrxMethod } from '../methods/methods';
import { getJsonAbi, listContractTypes } from '../../base/contracts/contractInstances';
import { TrxContract } from '../contracts/contracts';
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

    for (const contractName of listContractTypes(TrxContract.ABI_DIR)) {
      const jsonTronAbi = getJsonAbi(contractName, TrxContract.ABI_DIR, TrxContract.ACCESS_ABI_VALUES);

      for (const methodAbi of jsonTronAbi) {
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
    const methodId = bufferToHex(data.slice(0, 4));
    ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);

    const { contractName, abi: { name, inputs } } = this.methodsById[methodId];
    const names = inputs.map(({ name }) => name).filter(name => !!name);
    const types = inputs.map(({ type }) => type);

    const abiEncodedArgs = bufferToHex(data);
    const decodedArguments = TronWeb.utils.abi.decodeParams(names, types, abiEncodedArgs, true);

    const args = [];
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

