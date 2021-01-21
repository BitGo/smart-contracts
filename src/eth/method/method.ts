import { BaseMethod, BaseMethodResponse } from '../../base/method/baseMethod';
import * as abi from 'ethereumjs-abi';
import * as ethUtil from 'ethereumjs-util';
import { ensure } from '../../util/ensure';
import { EthMethodABI, EthParameter } from '../../base/iface';

export class Method extends BaseMethod<EthMethodABI> {
  /** @inheritdoc */
  call(params: { [key: string]: any }): MethodResponse {
    const types: string[] = [];
    const values: string[] = [];
    this.definition.inputs.forEach((input: EthParameter) => {
      ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
      values.push(params[input.name]);
      types.push(input.type);
    });

    return {
      data: ethUtil.addHexPrefix(this.getMethodId() + abi.rawEncode(types, values).toString('hex')),
      amount: '0',
    };
  }

  /** @inheritdoc */
  getMethodId(): string {
    return abi.methodID(this.getName(), this.definition.inputs.map((input) => input.type)).toString('hex');
  }

}

/** @inheritdoc */
export interface MethodResponse extends BaseMethodResponse {
  data: string;
  address?: string;
  amount?: string;
}
