import * as abi from 'ethereumjs-abi';
import { ensure } from '../../util/ensure';
import * as ethUtil from 'ethereumjs-util';

export type MethodsClass<M extends Method, T extends MethodsImp<M>> = new(methods: M[]) => T;
export type MethodClass<T extends Method> = new(...args: any[]) => T;

export interface Parameter {
  name: string
  type: string;
}

export interface MethodDefinition {
  name: string,
  type: string;
}

export interface Method {
  id: string;
  name: string;
  call(params: Parameter): any;
  explain(): MethodDefinition;
}

export interface Methods<T extends Method> {
  container: BaseMethodContainerMap<T>;
  explain(): MethodDefinition[];
}

export class MethodsImp<M extends Method> implements Methods<M> {
  container: BaseMethodContainerMap<M>;

  constructor(methodAbis: M[]) {
    this.container = this.parse(methodAbis);
  }

  call(params: { [key: string]: any }): any {
    throw Error();
  }

  explain(): MethodDefinition[] {
    return Object.keys(this.container).map((name: string) => this.container[name].explain());
  }

  private parse(methods: M[]): BaseMethodContainerMap<M> {
    return methods.reduce((collector: BaseMethodContainerMap<M>, method: M) => {
      collector[method.name] = method;
      return collector;
    }, {});
  }
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
    this.inputs.forEach((input: Parameter) => {
      ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
      values.push(params[input.name]);
      types.push(input.type);
    });

    return {
      data: ethUtil.addHexPrefix(this.id + abi.rawEncode(types, values).toString('hex')),
      amount: '0',
    };
  }

  explain(): MethodDefinition {
    return {
      name: this.name,
      type: this.type,
    };
  }

}

export interface BaseMethodContainerMap<k extends Method> {
  [key: string]: k;
}
