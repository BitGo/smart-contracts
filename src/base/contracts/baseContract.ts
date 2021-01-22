import * as path from 'path';
import * as fs from 'fs';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { ContractABI, MethodABI } from '../../eth/contract/json';

// import { MethodContainerMap, MethodManager } from '../method/manager';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export abstract class BaseContract {

  static readonly ABI_DIR: string;
  static readonly CONFIG_DIR: string;
  static readonly DEFAULT_INSTANCE_KEY: string;

  /**
   * The name of this contract type
   */
  protected readonly contractName: string;

  /**
   * Address of the contract instance
   */
  protected instanceAddress: string;

  /**
   * Address of the contract instance
   */
  protected contractInstances: ContractInstances;

  constructor(contractName:string,) {
    this.contractName = contractName;
  }

  /**
   * List the names of the available ABI definitions.
   * These are stored locally as JSON ABI definition files
   */
  public static listContractTypes(): string[] {
    return fs.readdirSync(path.join( __dirname, this.ABI_DIR)).map((fileName: string) => {
      ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
      return fileName.replace('.json', '');
    });
  }

  /**
   * Get the name of this contract type
   */
  getName(): string {
    return this.contractName;
  }

  /**
   * Read in and parse config for instances of this contract type
   * @param contractName The name of the contract to read the config for
   */
  protected static readContractInstances(contractName: string): ContractInstances {
    const config = fs.readFileSync(require.resolve(`${this.CONFIG_DIR}/instances.json`), 'utf-8');
    ensure(isValidJSON(config), `Invalid JSON: ${config}`);
    const parsedConfig = JSON.parse(config);
    ensure(parsedConfig[contractName], `Unknown contract: ${contractName}`);

    // Save them with the instance names lowercased, for easier lookup
    const result: {[key: string]: string} = {};
    Object.keys(parsedConfig[contractName]).forEach((instanceName: string) => {
      result[instanceName.toLowerCase()] = parsedConfig[contractName][instanceName];
    });
    return result;
  }

  /**
   * Set the instance address for this contract by name
   * @param name The name of the deployed contract to set the address for
   */
  instance(name: string): this {
    name = name.toLowerCase();
    ensure(this.contractInstances[name], `Unknown instance: ${name}`);
    this.instanceAddress = this.contractInstances[name];
    return this;
  }

}

export interface ContractInstances {
  [key: string]: string;
}
