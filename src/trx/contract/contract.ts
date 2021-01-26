import { BaseContract } from '../../base/contracts/baseContract';
import { ensure } from '../../util/ensure';
import { MethodContainerMap, MethodManager } from '../method/manager';

import { TrxContractABI, TrxMethodABI } from '../../base/iface';

/** @inheritdoc */
export class Contract extends BaseContract {
  static readonly ABI_DIR = '../../../trx/abis';
  static readonly CONFIG_DIR = '../../../trx/config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';


  /** @inheritdoc */
  private static readContractAbi(contractName: string): TrxContractABI {
    throw new Error("readContractAbi not implemented");
  }

  /** @inheritdoc */
  private readonly methodDefinitions: MethodManager;

  constructor(contractName: string) {
    super(contractName);
  }

  /** @inheritdoc */
  methods(): MethodContainerMap {
    throw new Error("method not implemented");
  }

  /** @inheritdoc */
  listMethods(): TrxMethodABI[] {
    throw new Error("method not implemented");
  }

  /** @inheritdoc */
  getAddress(): string {
    ensure(this.instanceAddress, `Instance address not set: ${this.instanceAddress}`);
    return this.instanceAddress;
  }

  /** @inheritdoc */
  address(address: string): this {
    this.instanceAddress = address.toLowerCase();
    return this;
  }
}

export { MethodResponse } from '../method/method';
