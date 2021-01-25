import * as fs from 'fs';
import * as path from 'path';
import { BaseContract } from '../../base/contracts/baseContract';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { MethodContainerMap, MethodManager } from '../method/manager';
import { EthContractABI, EthMethodABI } from '../../base/iface';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export class Contract extends BaseContract {
  // TODO: Preguntar a Fabi que hacer con estos parametros
  static readonly ABI_DIR = '../../../eth/abis';
  static readonly CONFIG_DIR = '../../../eth/config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';


  /**
   * Read in and parse an ABI file
   * @param contractName The name of the contract to read the file from
   *  There must be a file with this name locally, otherwise this function will throw
   */
  private static readContractAbi(contractName: string): EthContractABI {
    ensure(Contract.listContractTypes().includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(path.join( __dirname, `${this.ABI_DIR}/${contractName}.json`), 'utf-8');
    ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  /**
   * Internal list of contract method definitions
   */
  private readonly methodDefinitions: MethodManager;

  constructor(contractName: string) {
    super(contractName);
    this.contractInstances = Contract.readContractInstances(this.contractName);
    if (this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]) {
      this.address(this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]);
    }

    const contractAbi = Contract.readContractAbi(this.contractName);
    // TODO: define functionDefinition type
    const functions = contractAbi.filter((functionDefinition: any) => functionDefinition.type === 'function');
    this.methodDefinitions = new MethodManager(functions);
  }

  /**
   * Public mapping from method name to function call builder
   */
  methods(): MethodContainerMap {
    return this.methodDefinitions.getCallMap(this.instanceAddress);
  }

  /**
   * Getter to list the available methods for a given contract
   */
  listMethods(): EthMethodABI[] {
    return this.methodDefinitions.explain();
  }

  /**
   * Get the address of this instance
   */
  getAddress(): string {
    ensure(this.instanceAddress, `Instance address not set: ${this.instanceAddress}`);
    return this.instanceAddress;
  }

  /**
   * Set the instance address for this contract to the given address
   * @param address The address to set it to
   */
  address(address: string): this {
    this.instanceAddress = address.toLowerCase();
    return this;
  }
}

export { MethodResponse } from '../method';
