import * as abi from 'ethereumjs-abi';
import { ensure } from '../../util/ensure';
import * as ethUtil from 'ethereumjs-util';
import { Method, MethodDefinition, Parameter } from '../../base/methods/methods';
import * as ethers from 'ethers';
export interface EthMethodDefinition extends MethodDefinition {
  constant: boolean;
  payable: boolean;
  inputs: Parameter[];
  outputs?: Parameter[];
}

export class EthMethod implements Method {
  private _id: string;
  constant: boolean;
  payable: boolean;
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
    this.inputs = inputs;
    this.outputs = outputs;
    this.name = name;
    this.type = type;
  }

  call(params: { [key: string]: any }): any {
    const types: string[] = [];
    const values: string[] = [];
    let data = '';
    this.inputs.forEach((input) => {
      if (Array.isArray(input.components)) {
        let tuple = 'tuple(';
        input.components.forEach(component => {
          ensure(params[component.name] !== undefined, `Missing required parameter: ${component.name}`);
          tuple += component.type + ',';
          values.push(params[component.name]);
        });
        tuple = tuple.slice(0, -1);
        tuple += ')';
        
        types.push(tuple);
        const abiElement = 'function ' + this.name + '(' + tuple + ')';
        const iface = new ethers.utils.Interface([abiElement]);
        const methodId = iface.functions[this.name].sighash;
        data = methodId + ethers.utils.defaultAbiCoder.encode(types, [values]).slice(2);
            
      } else {
        ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
        values.push(params[input.name]);
        types.push(input.type);
        data = ethUtil.addHexPrefix(this.id + abi.rawEncode(types, values).toString('hex'));

      }
     
    });

    return {
      data,
      amount: '0',
    };
  }

  explain(): EthMethodDefinition {
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
