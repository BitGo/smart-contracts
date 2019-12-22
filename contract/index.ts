import * as assert from 'assert';
import * as fs from 'fs';
import { isValidJSON } from '../util/json';
import { ContractABI, MethodABI } from './json';
import { Method, MethodCall } from './method';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export class Contract {
  static readonly ABI_DIR = 'abis';

  /**
   * List the names of the available ABI definitions.
   * These are stored locally as JSON ABI definition files
   */
  static listContractTypes(): string[] {
    return fs.readdirSync(Contract.ABI_DIR).map((fileName: string) => {
      assert(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
      return fileName.replace('.json', '');
    });
  }

  /**
   * Read in and parse an ABI file
   * @param contractName The name of the contract to read the file from.
   *  There must be a file with this name locally, otherwise this function will throw
   * @return The parsed JSON abi definition of this contract
   */
  private static readContractAbi(contractName: string): ContractABI {
    assert(Contract.listContractTypes().includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(`${Contract.ABI_DIR}/${contractName}.json`, 'utf-8');
    assert(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  /**
   * Create a mapping of method name to a function that will call it with given parameters
   * @param methods Array of method objects from which to build the map
   */
  private static createMethodMap(methods: Method[]): MethodCallMap {
    return methods.reduce((acc: MethodCallMap, method: Method) => {
      acc[method.getName()] = method.getMethodCall();
      return acc;
    }, {});
  }

  /**
   * Public mapping from method name to function call builder
   */
  public methods: MethodCallMap;

  /**
   * Internal list of contract method definitions
   */
  private readonly methodDefinitions: Method[];

  constructor(contractName: string) {
    const contractAbi = Contract.readContractAbi(contractName);
    const functions = contractAbi.filter((functionDefinition) => functionDefinition.type === 'function');
    this.methodDefinitions = functions.map((functionDefinition) => new Method(functionDefinition));
    this.methods = Contract.createMethodMap(this.methodDefinitions);
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
}

interface MethodCallMap {
  [key: string]: MethodCall;
}

interface MethodDefinitionMap {
  [key: string]: MethodABI;
}
