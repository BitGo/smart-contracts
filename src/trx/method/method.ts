import { TrxMethodABI } from '../../base/iface';

export class Method {
  private readonly definition: TrxMethodABI;

  constructor(methodAbi: TrxMethodABI) {
    this.definition = methodAbi;
  }

  /** @inheritdoc */
  getName(): string {
    return this.definition.name;
  }

  /** @inheritdoc */
  call(params: { [key: string]: any }): MethodResponse {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  getMethodId(): string {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  explain(): TrxMethodABI {
    throw new Error('Method not implemented.');
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
