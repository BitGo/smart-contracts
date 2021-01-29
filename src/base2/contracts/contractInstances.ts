import fs from 'fs';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { Instance } from './contracts';
import {Method, MethodClass, MethodDefinition, Methods, MethodsClass, MethodsImp} from '../methods/methods';
import path from 'path';

/**
 * List the names of the available ABI definitions.
 * These are stored locally as JSON ABI definition files
 */
function listContractTypes(abiDirPath: string): string[] {
  return fs.readdirSync(path.join( __dirname, abiDirPath)).map((fileName: string) => {
    ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
    return fileName.replace('.json', '');
  });
}

export class ContractReader<M extends Method, T extends MethodsImp<M>> {
  protected readonly abiDirPath: string;
  protected readonly configDirPath: string;
  protected readonly defaultInstanceKey: string;
  readonly _methodsClass: MethodsClass<M, T>;
  readonly _methodClass: MethodClass<M>;

  constructor(
    abiDirPath: string,
    configDirPath: string,
    defaultInstanceKey: string,
    methodsClass: MethodsClass<M, T>,
    methodClass: MethodClass<M>,
  ) {
    if (!abiDirPath || !configDirPath || !defaultInstanceKey) {
      throw new Error('Default chain params not defined.');
    }
    this.abiDirPath = abiDirPath;
    this.configDirPath = configDirPath;
    this.defaultInstanceKey = defaultInstanceKey;
    this._methodsClass = methodsClass;
    this._methodClass = methodClass;
  }

  /**
   * Read in and parse config for instances of this contract type
   * @param contractName The name of the contract to read the config for
   */
  readContractInstances(contractName: string): Instance<M, T>[] {
    const instances = this.getInstances(contractName);
    const contract = this.getContract(contractName, listContractTypes(this.abiDirPath));

    // Save them with the instance names lowercased, for easier lookup
    return this.parse(instances, contract);
  }

  private getContract(contractName: string, contractTypesList: string[]) {
    ensure(contractTypesList.includes(contractName), `Unknown contract: ${contractName}`);
    const jsonAbi = fs.readFileSync(path.join( __dirname, `${this.abiDirPath}/${contractName}.json`), 'utf-8');
    ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
    return JSON.parse(jsonAbi);
  }

  private getInstances(contractName: string) {
    const config = fs.readFileSync(require.resolve(`${this.configDirPath}/instances.json`), 'utf-8');
    ensure(isValidJSON(config), `Invalid JSON: ${config}`);
    const parsedConfig = JSON.parse(config);
    ensure(parsedConfig[contractName], `Unknown contract: ${contractName}`);
    return parsedConfig[contractName];
  }

  private parse(parsedConfig: {[key: string]: string}, contract: MethodDefinition[]): Instance<M, T>[] {
    const methodList: M[] = this.parseMethods(contract);
    const result: Instance<M, T>[] = [];
    Object.keys(parsedConfig).forEach((instanceName: string) => {
      const address: string = parsedConfig[instanceName];
      result.push(new Instance<M, T>(instanceName.toLowerCase(), address, new this._methodsClass(methodList)));
    });
    return result;
  }

  private parseMethods(definitions: MethodDefinition[]): M[] {
    return definitions.reduce((collector: M[], def: MethodDefinition) => {
      const method: M = new this._methodClass(def);
      collector.push(method);
      return collector;
    }, []);
  }
}

export interface ContractInstances {
  [key: string]: string;
}
