import * as abi from 'ethereumjs-abi';
import * as ethUtil from 'ethereumjs-util';
import { ensure } from '../../util/ensure';
import { MethodABI, Parameter } from '../contract/json';

export class Method {
  private readonly definition: MethodABI;

  constructor(methodAbi: MethodABI) {
    this.definition = methodAbi;
  }

  /**
   * Get the name of this function
   */
  getName(): string {
    return this.definition.name;
  }

  /**
   * Build a method call using the loaded ABI
   */
  call(params: { [key: string]: any }): MethodResponse {
    const types: string[] = [];
    const values: string[] = [];
    this.definition.inputs.forEach((input: Parameter) => {
      ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
      values.push(params[input.name]);
      types.push(input.type);
    });

    return {
      data: ethUtil.addHexPrefix(this.getMethodId() + abi.rawEncode(types, values).toString('hex')),
      amount: '0',
    };
  }

  /**
   * Get the Method ID of this method. This defines the first 4 bytes of the transaction data to call the method
   */
  getMethodId(): string {
    return abi.methodID(this.getName(), this.definition.inputs.map((input) => input.type)).toString('hex');

  }

  /**
   * Get the JSON ABI definition of this method
   */
  explain(): MethodABI {
    return this.definition;
  }
}

/**
 * The response from a method call. This at least includes the transaction data required to call this method
 */
export interface MethodResponse {
  data: string;
  address?: string;
  amount?: string;
}
