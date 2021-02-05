import * as abi from 'ethereumjs-abi';
import { ensure } from '../../util/ensure';
import * as ethUtil from 'ethereumjs-util';
import { Method, MethodDefinition, Parameter } from '../../base/methods/methods';
// TronWeb does not use ES Modules so we must use require
const TronWeb = require('tronweb');

export interface TrxMethodDefinition extends MethodDefinition {
  constant?: boolean;
  payable?: boolean;
  inputs?: Parameter[];
  outputs?: Parameter[];
}

export class TrxMethod implements Method {
  private _id: string;
  constant?: boolean;
  payable?: boolean;
  inputs: Parameter[];
  outputs?: Parameter[];
  name: string;
  type: string;
  get id(): string {
    if (!this._id) {
      this._id = abi.methodID(this.name, this.inputs.map((input) => input.type)).toString('hex');
    }
    return this._id;
  }

  constructor(definitions: {[key:string]: any}) {
    const { constant, payable, inputs, outputs, name, type } = definitions;
    this.constant = constant;
    this.payable = payable;
    this.inputs = inputs || [];
    this.outputs = outputs;
    this.name = name;
    this.type = type;
  }

  call(params: { [key: string]: any }): any {
    const types: string[] = [];
    const values: string[] = [];
    this.inputs.forEach((input: Parameter) => {
      ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
      values.push(params[input.name]);
      types.push(input.type);
    });

    const tronEncoded = TronWeb.utils.abi.encodeParams(types, values);
    const ENCODED_PREFIX_REGEX = /^(0x)/;
    const dataEncoded = ethUtil.addHexPrefix(this.id + tronEncoded.replace(ENCODED_PREFIX_REGEX, ''));
    return {
      data: dataEncoded,
      amount: '0',
    };
  }

  explain(): TrxMethodDefinition {
    return {
      name: this.name,
      type: this.type,
      constant: this.constant,
      payable: this.payable,
      inputs: this.inputs,
      outputs: this.outputs,
    };
  }

}
