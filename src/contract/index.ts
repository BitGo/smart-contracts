import * as fs from 'fs';
import * as path from 'path';
import { ensure } from '../util/ensure';
import { isValidJSON } from '../util/json';
import { ContractABI, MethodABI } from './json';
import { MethodContainerMap, MethodManager } from './method/manager';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export class Contract {
  static readonly ABI_DIR = '../../abis';
  static readonly CONFIG_DIR = '../../config';
  static readonly DEFAULT_INSTANCE_KEY = 'default';

  /**
   * List the names of the available ABI definitions.
   * These are stored locally as JSON ABI definition files
   */
  public static listContractTypes(): string[] {
    return fs.readdirSync(path.join( __dirname, Contract.ABI_DIR)).map((fileName: string) => {
      ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
      return fileName.replace('.json', '');
    });
  }

  /**
   * Read in and parse an ABI file
   * @param contractName The name of the contract to read the file from
   *  There must be a file with this name locally, otherwise this function will throw
   */
  private static readContractAbi(contractName: string): ContractABI {
    ensure(Contract.listContractTypes().includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(path.join( __dirname, `${Contract.ABI_DIR}/${contractName}.json`), 'utf-8');
    ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  /**
   * Read in and parse config for instances of this contract type
   * @param contractName The name of the contract to read the config for
   */
  private static readContractInstances(contractName: string): ContractInstances {
    const config = fs.readFileSync(require.resolve(`${Contract.CONFIG_DIR}/instances.json`), 'utf-8');
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
   * Internal list of contract method definitions
   */
  private readonly methodDefinitions: MethodManager;

  /**
   * The name of this contract type
   */
  private readonly contractName: string;

  /**
   * Address of the contract instance
   */
  private readonly contractInstances: ContractInstances;

  /**
   * Address of the contract instance
   */
  private instanceAddress: string;

  constructor(contractName: string) {
    this.contractName = contractName;
    this.contractInstances = Contract.readContractInstances(this.contractName);
    if (this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]) {
      this.address(this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]);
    }

    const contractAbi = Contract.readContractAbi(this.contractName);
    const functions = contractAbi.filter((functionDefinition) => functionDefinition.type === 'function');
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
  listMethods(): MethodABI[] {
    return this.methodDefinitions.explain();
  }

  /**
   * Get the name of this contract type
   */
  getName(): string {
    return this.contractName;
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
  address(address: string): Contract {
    this.instanceAddress = address.toLowerCase();
    return this;
  }

  /**
   * Set the instance address for this contract by name
   * @param name The name of the deployed contract to set the address for
   */
  instance(name: string): Contract {
    name = name.toLowerCase();
    ensure(this.contractInstances[name], `Unknown instance: ${name}`);
    this.instanceAddress = this.contractInstances[name];
    return this;
  }
}

export interface ContractInstances {
  [key: string]: string;
}
