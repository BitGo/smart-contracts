import fs from 'fs';
import { ensure, ensureExist } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { Instance, InstanceImpl } from './contracts';
import { Method, MethodClass, MethodDefinition, MethodsClass, Methods } from '../methods/methods';
import path from 'path';

/**
 * List the names of the available ABI definitions.
 * These are stored locally as JSON ABI definition files
 */
export function listContractTypes(abiDirPath: string): string[] {
  return fs.readdirSync(path.join( __dirname, abiDirPath)).map((fileName: string) => {
    ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
    return fileName.replace('.json', '');
  });
}

/**
 * Return specific ABI as JSON
 * @param contractName The name of the contract to read the ABI for
 * @param accessAbiValues Access values to the ABI, some contracts has sub levels to access the ABI, e.g Tron has {"entrys" : [..ABI]}
 * 
 */
export function getJsonAbi(contractName: string, abiDirPath : string, accessAbiValues : string[] = []) {
  const jsonAbi = fs.readFileSync(path.join( __dirname, `${abiDirPath}/${contractName}.json`), 'utf-8');
  ensure(isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
  let parsedJsonAbi = JSON.parse(jsonAbi);
  if (accessAbiValues) {
    accessAbiValues.forEach(field => {
      parsedJsonAbi = parsedJsonAbi[field];
    });
  }
  return ensureExist(parsedJsonAbi, `Invalid JSON field`);
}


export class ContractReader<TMethod extends Method, TMethods extends Methods<TMethod>> {
  protected readonly abiDirPath: string;
  protected readonly configDirPath: string;
  protected readonly defaultInstanceKey: string;
  private readonly methodsClass: MethodsClass<TMethod, TMethods>;
  private readonly methodClass: MethodClass<TMethod>;

  constructor(
    abiDirPath: string,
    configDirPath: string,
    defaultInstanceKey: string,
    methodsClass: MethodsClass<TMethod, TMethods>,
    methodClass: MethodClass<TMethod>,
  ) {
    if (!abiDirPath || !configDirPath || !defaultInstanceKey) {
      throw new Error('Default chain params not defined.');
    }
    this.abiDirPath = abiDirPath;
    this.configDirPath = configDirPath;
    this.defaultInstanceKey = defaultInstanceKey;
    this.methodsClass = methodsClass;
    this.methodClass = methodClass;
  }

  /**
   * Read in and parse config for instances of this contract type
   * @param contractName The name of the contract to read the config for
   * @param accessAbiValues Some contracts has sub levels to access the ABI, e.g Tron has {"entrys" : [..ABI]}
   */
  readContractInstances(contractName: string, accessAbiValues : string[] = []): Instance<TMethod, TMethods>[] {
    const instances = this.getInstances(contractName);
    const contract = this.getContract(contractName, listContractTypes(this.abiDirPath), accessAbiValues);

    // Save them with the instance names lowercased, for easier lookup
    return this.parse(instances, contract);
  }


  /**
   * Return the contract specific ABI
   * @param contractName The name of the contract to 
   * @param contractTypesList 
   * @param accessAbiValues Access values to the ABI, some contracts has sub levels to access the ABI, e.g Tron has {"entrys" : [..ABI]}
   */
  public getContract(contractName: string, contractTypesList: string[], accessAbiValues : string[] = []) {
    ensure(contractTypesList.includes(contractName), `Unknown contract: ${contractName}`);
    return getJsonAbi(contractName, this.abiDirPath, accessAbiValues);
  }

  private getInstances(contractName: string) {
    const config = fs.readFileSync(require.resolve(`${this.configDirPath}/instances.json`), 'utf-8');
    ensure(isValidJSON(config), `Invalid JSON: ${config}`);
    const parsedConfig = JSON.parse(config);
    ensure(parsedConfig[contractName], `Unknown contract: ${contractName}`);
    return parsedConfig[contractName];
  }

  private parse(parsedConfig: {[key: string]: string}, contract: MethodDefinition[]): Instance<TMethod, TMethods>[] {
    const methodList: TMethod[] = this.parseMethods(contract);
    const result: Instance<TMethod, TMethods>[] = [];

    Object.keys(parsedConfig).forEach((instanceName: string) => {
      const address: string = parsedConfig[instanceName];
      result.push(new InstanceImpl<TMethod, TMethods>(instanceName.toLowerCase(), new this.methodsClass(methodList), address));
    });

    // If no exists a default intance create one
    if (!Object.keys(parsedConfig).some((instanceName: string) => instanceName === 'default')) {
      result.push(new InstanceImpl<TMethod, TMethods>('default', new this.methodsClass(methodList)));
    }
    return result;
  }

  private parseMethods(definitions: MethodDefinition[]): TMethod[] {
    return definitions.reduce((collector: TMethod[], def: MethodDefinition) => {
      const method: TMethod = new this.methodClass(def);
      collector.push(method);
      return collector;
    }, []);
  }
}

export interface ContractInstance {
  [key: string]: string;
}
