import * as assert from 'assert';
import * as abi from 'ethereumjs-abi';
import * as ethUtil from 'ethereumjs-util';
import { MethodABI, Parameter } from './json';

export class Method {
  private readonly definition: MethodABI;

  constructor(methodAbi: MethodABI) {
    this.definition = methodAbi;
  }

  /**
   * Get the name of this function
   * @return The name of the function
   */
  getName(): string {
    return this.definition.name;
  }

  /**
   * Build a method call using the loaded ABI
   * @return A MethodCall object including the transaction data required to call the function with the given parameters
   */
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
        amount: '0',
      };
    };
  }

  /**
   * Get the Method ID of this method. This defines the first 4 bytes of the transaction data to call the method
   * @return Hex string of the Method ID. This will always be 4 bytes
   */
  getMethodId(): string {
    return abi.methodID(this.getName(), this.definition.inputs.map((input) => input.type)).toString('hex');

  }

  /**
   * Get the JSON ABI definition of this method
   * @return the ABI definition including parameter definitions, return type definitions, and the name of the method
   */
  define(): MethodABI {
    return this.definition;
  }
}

/**
 * A function that takes an object of parameter names and values, and outputs a method call response
 */
export type MethodCall = (params: { [key: string]: any }) => MethodResponse;

/**
 * The response from a method call. This at least includes the transaction data required to call this method
 */
export interface MethodResponse {
  data: string;
  address?: string;
  amount?: string;
}
