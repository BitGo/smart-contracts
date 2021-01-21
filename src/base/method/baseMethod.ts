import { MethodABI } from '../iface';


export abstract class BaseMethod<K extends MethodABI> {
  protected readonly definition: K;

  constructor(methodAbi: K) {
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
  abstract call(params: { [key: string]: any }): BaseMethodResponse;

  /**
   * Get the Method ID of this method.   
   */
  abstract getMethodId(): string;

  /**
   * Get the JSON ABI definition of this method
   */
  explain(): K {
    return this.definition;
  }
}

/**
 * The response from a method call. This at least includes the transaction data required to call this method
 */
export interface BaseMethodResponse {
  data: string;
  address?: string;
  amount?: string;
}
