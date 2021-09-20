import { ensure, ensureExist } from '../../util/ensure';
import { Instance, InstanceImpl } from './contracts';
import { Method, MethodClass, MethodDefinition, MethodsClass, Methods } from '../methods/methods';

import EthAbiContracts from '../../../eth/abis';
import TrxAbiContracts from '../../../trx/abis';

import EthInstances from '../../../eth/config/instances.json';
import TrxInstances from '../../../trx/config/instances.json';


export const contracts = { eth: EthAbiContracts, trx: TrxAbiContracts };
export const instances = { eth: EthInstances, trx: TrxInstances };

/**
 * List the names of the available ABI definitions.
 * These are stored locally as JSON ABI definition files
 */
export function listContractTypes(chainName: string): string[] {
  return Object.keys(contracts[chainName]);
}

/**
 * Return specific ABI
 * @param contractName The name of the contract to read the ABI for
 * @param chainName The name of the chain to read the ABI for
 * @param accessAbiValues Access values to the ABI, some contracts has sub levels to access the ABI, e.g Tron has {"entrys" : [..ABI]}
 * 
 */
export function getAbiContract(contractName: string, chainName: string, accessAbiValues : string[] = []) {
  let contract = contracts[chainName][contractName];
  if (accessAbiValues) {
    accessAbiValues.forEach(field => {
      contract = contract[field];
    });
  }
  return ensureExist(contract, `Invalid JSON field`);
}


export class ContractReader<TMethod extends Method, TMethods extends Methods<TMethod>> {
  protected readonly chainName: string;
  protected readonly defaultInstanceKey: string;
  private readonly methodsClass: MethodsClass<TMethod, TMethods>;
  private readonly methodClass: MethodClass<TMethod>;

  constructor(
    chainName: string,
    defaultInstanceKey: string,
    methodsClass: MethodsClass<TMethod, TMethods>,
    methodClass: MethodClass<TMethod>,
  ) {
    if (!chainName || !defaultInstanceKey) {
      throw new Error('Default chain params not defined.');
    }
    this.chainName = chainName;
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
    const instances = this.getInstances(contractName, this.chainName);
    const contract = this.getContract(contractName, listContractTypes(this.chainName), accessAbiValues);

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
    return getAbiContract(contractName, this.chainName, accessAbiValues);
  }

  private getInstances(contractName: string, chainName: string) {
    const config = instances[chainName];
    ensure(config[contractName], `Unknown contract: ${contractName}`);
    return config[contractName];
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
