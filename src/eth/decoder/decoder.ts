import { methodID, rawDecode } from 'ethereumjs-abi';
import { bufferToHex } from 'ethereumjs-util';
import * as fs from 'fs';
import * as path from 'path';

import { formatValue } from './types';
import { Contract } from '../contract/contract';
import { EthContractABI } from '../../base/iface';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { BaseDecoder } from '../../base/decoder/baseDecoder';
import { FunctionArgument, FunctionCallExplanation, MethodIdMapping } from './iface';

/** @inheritdoc */
export class Decoder extends BaseDecoder<MethodIdMapping, FunctionCallExplanation, EthContractABI> {
  /** @inheritdoc */
  protected loadMethods(): MethodIdMapping {
    const result: MethodIdMapping = {};

    for (const contractName of Contract.listContractTypes(Contract.ABI_DIR)) {
      const abi = fs.readFileSync(path.join( __dirname, `${Contract.ABI_DIR}/${contractName}.json`), 'utf-8');
      ensure(isValidJSON(abi), `Invalid JSON: ${abi}`);
      const jsonAbi: EthContractABI = JSON.parse(abi);

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

  protected readonly methodsById: MethodIdMapping;

  constructor() {
    super();
  }

  /** @inheritdoc */
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
