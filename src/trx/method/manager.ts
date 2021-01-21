import { BaseMethodManager } from '../../base/method/baseManager';
import { MethodContainer } from './container';
import { TrxMethodABI, TrxContractABI } from '../../base/iface';

/** @inheritdoc */
export class MethodManager extends BaseMethodManager<TrxMethodABI> {

  loadMethods(methodAbis: TrxContractABI): void {
    throw new Error('Method not implemented');
  }

}
export interface MethodContainerMap {
  [key: string]: MethodContainer;
}
