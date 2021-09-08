import { EthMethod } from '../methods/methods';
import { ContractReader } from '../../base/contracts/contractInstances';
import { ensureExist } from '../../util/ensure';
import { Contract, Instance } from '../../base/contracts/contracts';
import { MethodDefinition, Methods, MethodsImpl } from '../../base/methods/methods';

export class EthContract implements Contract<EthMethod> {
  static readonly chainName = 'eth';
  private readonly DEFAULT_INSTANCE_KEY = 'default';
  contractInstances: Instance<EthMethod, Methods<EthMethod>>[];
  contractReader: ContractReader<EthMethod, Methods<EthMethod>>;

  constructor(readonly name: string) {
    this.contractReader = new ContractReader<EthMethod
      , Methods<EthMethod>>(EthContract.chainName, this.DEFAULT_INSTANCE_KEY, MethodsImpl, EthMethod);
    this.contractInstances = this.contractReader.readContractInstances(name);
  }

  instance(name?: string): Instance<EthMethod, Methods<EthMethod>> {
    name = name ? name.toLowerCase() : this.DEFAULT_INSTANCE_KEY;
    const instance = this.contractInstances.find((i) => i.name === name);
    return ensureExist(instance, `Unknown instance: ${name}`);
  }

  listMethods(): MethodDefinition[] {
    return this.instance().explain().filter(method => method.type === 'function');
  }
}
