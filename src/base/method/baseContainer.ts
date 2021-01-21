import { BaseMethod, BaseMethodResponse } from './baseMethod';
import { MethodABI } from '../iface';

/**
 * Wrapper class for methods with the same name
 * Since methods can overload each other, we need this to be able to call methods by name and
 *   intelligently determine the correct one to call by parameter
 */
export abstract class BaseMethodContainer<K extends MethodABI> {
  protected readonly methods: BaseMethod<K>[];
  protected address: string;

  constructor() {
    this.methods = [];
  }

  /**
   * Add a method to this container
   * @param method The method to add
   */
  add(method: BaseMethod<K>): void {
    this.methods.push(method);
  }

  /**
   * Set the instance address of this deployed contract
   * @param address The address to set
   */
  setAddress(address: string): void {
    this.address = address;
  }

  /**
   * Describe the interface for methods
   */
  explain(): K[] {
    return this.methods.map((method) => method.explain());
  }

  /**
   * Call this method with the given parameters
   * @param args Solidity parameters to call the method with
   */
  abstract call(args: { [key: string]: any }): BaseMethodResponse;
}
