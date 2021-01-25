import { Method } from '.';
import { MethodContainer } from './container';
import { EthMethodABI } from '../../base/iface';

/**
 * Manages all of the methods for a given contract
 */
export class MethodManager {
  private readonly methods: MethodContainerMap;

  constructor(methodAbis: EthMethodABI[]) {
    this.methods = {};
    methodAbis.map((functionDefinition: EthMethodABI) => {
      const method = new Method(functionDefinition);
      if (this.methods[method.getName()] === undefined) {
        this.methods[method.getName()] = new MethodContainer();
      }
      this.methods[method.getName()].add(method);
    });
  }

  /**
   * Get mapping from method names to function call builders for them
   * @param [instanceAddress] the deployed address for this contract
   */
  getCallMap(instanceAddress?: string): MethodContainerMap {
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
  explain(): EthMethodABI[] {
    let result: EthMethodABI[] = [];
    Object.keys(this.methods).forEach((methodName: string) => {
      const methodContainer = this.methods[methodName];
      result = result.concat(methodContainer.explain());
    });
    return result;
  }
}

export interface MethodContainerMap {
  [key: string]: MethodContainer;
}
