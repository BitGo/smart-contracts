import { BaseMethodContainer } from './baseContainer';
import { MethodABI } from '../iface';

/**
 * Manages all of the methods for a given contract
 */
export abstract class BaseMethodManager<K extends MethodABI> {
  protected methods: BaseMethodContainerMap<K>;

  constructor(methodAbis: K[]) {
    this.methods = {};
    this.loadMethods(methodAbis);
  }

  loadMethods(methodAbis: K[]): void {
    throw new Error('Load Methods not implemented.');
  }

  /**
   * Get mapping from method names to function call builders for them
   * @param [instanceAddress] the deployed address for this contract
   */
  getCallMap(instanceAddress?: string): BaseMethodContainerMap<K> {
    // Update the instance address for all methods
    Object.keys(this.methods).forEach((methodName: string) => {
      const methodContainer = this.methods[methodName];
      if (instanceAddress) {
        methodContainer.setAddress(instanceAddress);
      }
    });
    return this.methods;
  }

  /**
   * Describe the interfaces for all methods
   */
  explain(): K[] {
    let result: K[] = [];
    Object.keys(this.methods).forEach((methodName: string) => {
      const methodContainer = this.methods[methodName];
      result = result.concat(methodContainer.explain());
    });
    return result;
  }
}

export interface BaseMethodContainerMap<k extends MethodABI> {
  [key: string]: BaseMethodContainer<k>;
}
