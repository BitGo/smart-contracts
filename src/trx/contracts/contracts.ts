import { TrxMethod } from '../methods/methods';
import { ContractReader } from '../../base/contracts/contractInstances';
import { ensureExist } from '../../util/ensure';
import { Contract, Instance } from '../../base/contracts/contracts';
import { MethodDefinition, Methods, MethodsImpl } from '../../base/methods/methods';

export class TrxContract implements Contract<TrxMethod> {
  static readonly ABI_DIR = '../../../trx/abis';
  static readonly CONFIG_DIR = '../../../trx/config';
  private readonly DEFAULT_INSTANCE_KEY = 'default';
  static readonly ACCESS_ABI_VALUES = ['entrys'];
  _contractInstances: Instance<TrxMethod, Methods<TrxMethod>>[];
  _contractReader: ContractReader<TrxMethod, Methods<TrxMethod>>;

  constructor(readonly name: string) {
    this._contractReader = new ContractReader<TrxMethod
      , Methods<TrxMethod>>(TrxContract.ABI_DIR, TrxContract.CONFIG_DIR, this.DEFAULT_INSTANCE_KEY, MethodsImpl, TrxMethod);
    this._contractInstances = this._contractReader.readContractInstances(name, TrxContract.ACCESS_ABI_VALUES );
  }

  instance(name?: string): Instance<TrxMethod, Methods<TrxMethod>> {
    name = name ? name.toLowerCase() : this.DEFAULT_INSTANCE_KEY;
    const instance = this._contractInstances.find((i) => i.name === name);
    return ensureExist(instance, `Unknown instance: ${name}`);
  }
  
  listMethods(): MethodDefinition[] {
    return this.instance().explain().filter(method => method.type === 'Function');
  }
}
