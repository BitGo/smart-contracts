import { BaseMethod, BaseMethodResponse } from '../../base/method/baseMethod';
import { TrxMethodABI } from '../../base/iface';

export class Method extends BaseMethod<TrxMethodABI> {
  /** @inheritdoc */
  call(params: { [key: string]: any }): MethodResponse {
    throw new Error('Method not implemented');
  }

  /** @inheritdoc */
  getMethodId(): string {
    throw new Error('Method not implemented');
  }

}

/** @inheritdoc */
export interface MethodResponse extends BaseMethodResponse {
  data: string;
  address?: string;
  amount?: string;
}
