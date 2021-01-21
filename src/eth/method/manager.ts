import { BaseMethodManager } from '../../base/method/baseManager';
import { Method } from './method';
import { MethodContainer } from './container';
import { EthMethodABI, EthContractABI } from '../../base/iface';

/** @inheritdoc */
export class MethodManager extends BaseMethodManager<EthMethodABI> {

  loadMethods(methodAbis: EthContractABI): void {
    methodAbis.map((functionDefinition: EthMethodABI) => {
      const method = new Method(functionDefinition);
      if (this.methods[method.getName()] === undefined) {
        this.methods[method.getName()] = new MethodContainer();
      }
      this.methods[method.getName()].add(method);
    });
    
  }

}
export interface MethodContainerMap {
  [key: string]: MethodContainer;
}
