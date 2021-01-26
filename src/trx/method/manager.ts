import { Method } from './method';
import { MethodContainer } from './container';
import { TrxMethodABI } from '../../base/iface';

/** @inheritdoc */
export class MethodManager {
  private readonly methods: MethodContainerMap;

  constructor(methodAbis: TrxMethodABI[]) {
    throw new Error('Constructor not implemented.');
  }

  /** @inheritdoc */
  getCallMap(instanceAddress?: string): MethodContainerMap {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  explain(): TrxMethodABI[] {
    throw new Error('Method not implemented.');
  }
}

export interface MethodContainerMap {
  [key: string]: MethodContainer;
}
