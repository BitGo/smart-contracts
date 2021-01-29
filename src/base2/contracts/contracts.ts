import { ensureExist } from '../../util/ensure';
import { ContractReader } from './contractInstances';
import {BaseMethodContainerMap, EthMethod, Method, Methods, MethodsImp} from '../methods/methods';

export interface Contract<T extends Method> {
  name: string;
  instance(name: string): Instance<T, MethodsImp<T>>;
}

export class EthContract implements Contract<EthMethod> {
  static readonly ABI_DIR = '../../../eth/abis';
  static readonly CONFIG_DIR = '../../../eth/config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';
  _contractInstances: Instance<EthMethod, MethodsImp<EthMethod>>[];
  _contractReader: ContractReader<EthMethod, MethodsImp<EthMethod>>;

  constructor(readonly name: string) {
    this._contractReader = new ContractReader<EthMethod
      , MethodsImp<EthMethod>>(EthContract.ABI_DIR, EthContract.CONFIG_DIR, EthContract.DEFAULT_INSTANCE_KEY, MethodsImp, EthMethod);
    this._contractInstances = this._contractReader.readContractInstances(name);
  }

  instance(name: string): Instance<EthMethod, MethodsImp<EthMethod>> {
    name = name.toLowerCase();
    const instance = this._contractInstances.find((i) => i.name === name);
    return ensureExist(instance, `Unknown instance: ${name}`);
  }
}

export class Instance<M extends Method, T extends MethodsImp<M>> {
  name: string;
  address: string;
  methodsHandler: T;

  constructor(name: string, address: string, methodsHandler: T) {
    this.name = name;
    this.address = address;
    this.methodsHandler = methodsHandler;
  }

  methods(): BaseMethodContainerMap<M> {
    return this.methodsHandler.container;
  }
}
