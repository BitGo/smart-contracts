
import { BaseMethodContainer } from '../../base/method/baseContainer';
import { MethodResponse } from './method';
import { TrxMethodABI } from '../../base/iface';
export class MethodContainer extends BaseMethodContainer<TrxMethodABI> {
  /** @inheritdoc */
  call(args: { [key: string]: any }): MethodResponse {
    throw new Error('Method not implemented');
  }
}
