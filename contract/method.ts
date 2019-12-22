import * as assert from 'assert';
import * as abi from 'ethereumjs-abi';
import * as ethUtil from 'ethereumjs-util';
import { MethodABI, Parameter } from './json';

export class Method {
  private readonly definition: MethodABI;

  constructor(methodAbi: MethodABI) {
    this.definition = methodAbi;
  }

  getName(): string {
    return this.definition.name;
  }

  getMethodCall(): MethodCall {
    return (params: { [key: string]: any }) => {
      const types = [];
      const values = [];
      this.definition.inputs.forEach((input: Parameter) => {
        assert(params[input.name], `Missing required parameter: ${input.name}`);
        values.push(params[input.name]);
        types.push(input.type);
      });

      return {
        data: ethUtil.addHexPrefix(this.getMethodId() + abi.rawEncode(types, values).toString('hex')),
      };
    };
  }

  getMethodId(): string {
    return abi.methodID(this.getName(), this.definition.inputs.map((input) => input.type)).toString('hex');

  }

  define(): MethodABI {
    return this.definition;
  }
}

export type MethodCall = (params: { [key: string]: any }) => MethodResponse;

export interface MethodResponse {
  data: string;
}
