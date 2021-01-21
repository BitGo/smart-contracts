import { BaseContract } from '../../base/contracts/baseContract';
import { MethodManager, MethodContainerMap } from '../method/manager';
import { EthContractABI, EthMethodABI } from '../../base/iface';

export class Contract extends BaseContract<EthMethodABI, EthContractABI> {
  static readonly ABI_DIR = '../../../eth/abis';
  static readonly CONFIG_DIR = '../../../eth/config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';

  constructor(contractName: string) {
    super(contractName, Contract.ABI_DIR, Contract.CONFIG_DIR, Contract.DEFAULT_INSTANCE_KEY);
  }

  /** @inheritdoc */
  protected instantiateMethodManager(functions: EthContractABI): MethodManager {
    return new MethodManager(functions);
  }

  /** @inheritdoc */
  protected loadMethodDefinitions(contractTypesList: string[]): MethodManager {
    return super.loadMethodDefinitions(contractTypesList);
  }

  /** @inheritdoc */
  methods(): MethodContainerMap {
    return super.methods();
  }

}

export { MethodResponse } from '../method/method';
