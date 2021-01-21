import * as path from 'path';
import * as fs from 'fs';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { BaseMethodManager, BaseMethodContainerMap } from '../method/baseManager';
import { ContractABI, MethodABI } from '../iface';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export abstract class BaseContract<K extends MethodABI, T extends ContractABI> {

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

  /**
   * Internal list of contract method definitions
   */
  protected methodDefinitions: BaseMethodManager<K>;

  protected readonly abiDirPath: string;
  protected readonly configDirPath: string;
  protected readonly defaultInstanceKey: string;

  constructor(
    contractName:string,
    abiDirPath:string,
    configDirPath:string,
    defaultInstanceKey:string,
  ) {
    if (!abiDirPath || !configDirPath || !defaultInstanceKey) {
      throw new Error('Default chain params not defined.');
    }
    this.abiDirPath = abiDirPath;
    this.configDirPath = configDirPath;
    this.defaultInstanceKey = defaultInstanceKey;
    this.contractName = contractName;
    this.methodDefinitions = this.loadMethodDefinitions(BaseContract.listContractTypes(abiDirPath));
  }

  /**
   * List the names of the available ABI definitions.
   * These are stored locally as JSON ABI definition files
   */
  public static listContractTypes(abiDirPath: string): string[] {
    return fs.readdirSync(path.join( __dirname, abiDirPath)).map((fileName: string) => {
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
  protected readContractInstances(contractName: string): ContractInstances {
    const config = fs.readFileSync(require.resolve(`${this.configDirPath}/instances.json`), 'utf-8');
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

  /**
   * Getter to list the available methods for a given contract
   */
  listMethods(): K[] {
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

  /**
   * Public mapping from method name to function call builder
   */
  methods(): BaseMethodContainerMap<K> {
    return this.methodDefinitions.getCallMap(this.instanceAddress);
  }

  /**
   * Read in and parse an ABI file
   * @param contractName The name of the contract to read the file from
   * @param contractTypesList Contract type list for the chain
   *  There must be a file with this name locally, otherwise this function will throw
   */
  protected readContractAbi(contractName: string, contractTypesList: string[]): T {
    ensure(contractTypesList.includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(path.join( __dirname, `${this.abiDirPath}/${contractName}.json`), 'utf-8');
    ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  /**
   * @param contractTypesList Contract type list for the chain
   * Load the methods definition instantiating a particular 
   * method manager for the chain 
   */
  protected loadMethodDefinitions(contractTypesList: string[]): BaseMethodManager<K> {
    this.contractInstances = this.readContractInstances(this.contractName);
    if (this.contractInstances[this.defaultInstanceKey]) {
      this.address(this.contractInstances[this.defaultInstanceKey]);
    }

    const contractAbi = this.readContractAbi(this.contractName, contractTypesList);
    const functions = contractAbi.filter((functionDefinition) => functionDefinition.type.toLowerCase() === 'function');
    return this.instantiateMethodManager(functions);
  }

  protected instantiateMethodManager(functions: ContractABI): BaseMethodManager<K> {
    throw new Error('Method not implemented.');
  }

}

export interface ContractInstances {
  [key: string]: string;
}
