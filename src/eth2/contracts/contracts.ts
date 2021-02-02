import { EthMethod } from '../../eth2/methods/methods';
import { ContractReader } from '../../base2/contracts/contractInstances';
import { ensureExist } from '../../util/ensure';
import { Contract, Instance } from '../../base2/contracts/contracts';
import { Methods, MethodsImpl } from '../../base2/methods/methods';

export class EthContract implements Contract<EthMethod> {
  static readonly ABI_DIR = '../../../eth/abis';
  static readonly CONFIG_DIR = '../../../eth/config';
  private readonly DEFAULT_INSTANCE_KEY = 'default';
  _contractInstances: Instance<EthMethod, Methods<EthMethod>>[];
  _contractReader: ContractReader<EthMethod, Methods<EthMethod>>;

  constructor(readonly name: string) {
    this._contractReader = new ContractReader<EthMethod
      , Methods<EthMethod>>(EthContract.ABI_DIR, EthContract.CONFIG_DIR, this.DEFAULT_INSTANCE_KEY, MethodsImpl, EthMethod);
    this._contractInstances = this._contractReader.readContractInstances(name);
  }

  instance(name?: string): Instance<EthMethod, Methods<EthMethod>> {
    name = name ? name.toLowerCase() : this.DEFAULT_INSTANCE_KEY;
    const instance = this._contractInstances.find((i) => i.name === name);
    return ensureExist(instance, `Unknown instance: ${name}`);
  }
}
