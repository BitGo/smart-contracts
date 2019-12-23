import * as fs from 'fs';
import { ensure } from '../util/ensure';
import { isValidJSON } from '../util/json';
import { ContractABI, MethodABI } from './json';
import { Method, MethodCall, MethodResponse } from './method';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export class Contract {
  static readonly ABI_DIR = 'abis';
  static readonly CONFIG_DIR = 'config';

  /**
   * List the names of the available ABI definitions.
   * These are stored locally as JSON ABI definition files
   */
  public static listContractTypes(): string[] {
    return fs.readdirSync(Contract.ABI_DIR).map((fileName: string) => {
      ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
      return fileName.replace('.json', '');
    });
  }

  /**
   * Read in and parse an ABI file
   * @param contractName The name of the contract to read the file from
   *  There must be a file with this name locally, otherwise this function will throw
   * @return The parsed JSON abi definition of this contract
   */
  private static readContractAbi(contractName: string): ContractABI {
    ensure(Contract.listContractTypes().includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(`${Contract.ABI_DIR}/${contractName}.json`, 'utf-8');
    ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  /**
   * Read in and parse config for instances of this contract type
   * @param contractName The name of the contract to read the config for
   * @return Mapping of names and deployed instance addresses of this contract type
   */
  private static readContractInstances(contractName: string): ContractInstances {
    const config = fs.readFileSync(`${Contract.CONFIG_DIR}/instances.json`, 'utf-8');
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
  private readonly methodDefinitions: Method[];

  /**
   * Address of the contract instance
   */
  private instanceAddress: string;

  /**
   * The name of this contract type
   */
  private contractName: string;

  /**
   * Address of the contract instance
   */
  private contractInstances: ContractInstances;

  constructor(contractName: string) {
    this.contractName = contractName;
    const contractAbi = Contract.readContractAbi(this.contractName);
    this.contractInstances = Contract.readContractInstances(this.contractName);
    const functions = contractAbi.filter((functionDefinition) => functionDefinition.type === 'function');
    this.methodDefinitions = functions.map((functionDefinition) => new Method(functionDefinition));
  }

  /**
   * Public mapping from method name to function call builder
   */
  methods(): MethodCallMap {
    return this.methodDefinitions.reduce((acc: MethodCallMap, method: Method) => {
      acc[method.getName()] = (params: { [key: string]: any }): MethodResponse => {
        const res: MethodResponse = method.getMethodCall()(params);
        if (this.instanceAddress) {
          res.address = this.instanceAddress;
        }
        return res;
      };
      return acc;
    }, {});
  }

  /**
   * Getter to list the available methods for a given contract
   */
  listMethods(): MethodDefinitionMap {
    return this.methodDefinitions.reduce((acc: MethodDefinitionMap, methodDefinition: Method) => {
      acc[methodDefinition.getName()] = methodDefinition.define();
      return acc;
    }, {});
  }

  /**
   * Get the name of this contract type
   */
  getName(): string {
    return this.contractName;
  }

  /**
   * Set the instance address for this contract to the given address
   * @param address The address to set it to
   */
  address(address: string): Contract {
    this.instanceAddress = address;
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

interface MethodCallMap {
  [key: string]: MethodCall;
}

interface MethodDefinitionMap {
  [key: string]: MethodABI;
}

export interface ContractInstances {
  [key: string]: string;
}
