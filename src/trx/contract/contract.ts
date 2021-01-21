import { BaseContract } from '../../base/contracts/baseContract';
import { MethodManager, MethodContainerMap } from '../method/manager';
import { TrxContractABI, TrxMethodABI } from '../../base/iface';

export class Contract extends BaseContract<TrxMethodABI, TrxContractABI> {
  static readonly ABI_DIR = '../../../trx/abis';
  static readonly CONFIG_DIR = '../../../trx/config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';

  constructor(contractName: string) {
    super(contractName, Contract.ABI_DIR, Contract.CONFIG_DIR, Contract.DEFAULT_INSTANCE_KEY);
  }

  /** @inheritdoc */
  protected instantiateMethodManager(functions: TrxContractABI): MethodManager {
    throw new Error('Method not implemented');
    
  }

  /** @inheritdoc */
  protected loadMethodDefinitions(contractTypesList: string[]): MethodManager {
    throw new Error('Method not implemented');
  }

  /** @inheritdoc */
  methods(): MethodContainerMap {
    throw new Error('Method not implemented');

  }

}

export { MethodResponse } from '../method/method';
