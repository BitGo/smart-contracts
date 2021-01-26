import { Method, MethodResponse } from './method';
import { EthMethodABI, EthParameter } from '../../base/iface';

/** @inheritdoc */
export class MethodContainer {
  private readonly methods: Method[];
  private address: string;

  constructor() {
    this.methods = [];
  }

  /** @inheritdoc */
  add(method: Method): void {
    this.methods.push(method);
  }

  /** @inheritdoc */
  setAddress(address: string): void {
    this.address = address;
  }

  /** @inheritdoc */
  explain(): EthMethodABI[] {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  call(args: { [key: string]: any }): MethodResponse {
    throw new Error('Method not implemented.');
  }
}
