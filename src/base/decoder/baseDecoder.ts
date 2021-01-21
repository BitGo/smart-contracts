import { ContractABI } from '../iface';
import { BaseFunctionCallExplanation, BaseMethodIdMapping } from './iface';

// import { MethodContainerMap, MethodManager } from '../method/manager';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export abstract class BaseDecoder< K extends BaseMethodIdMapping, T extends BaseFunctionCallExplanation, S extends ContractABI > {

  /**
   * Read in and parse all methods from all defined contract abis
   * @return A mapping of method IDs (in hex string format) to the method ID object
   */
  protected abstract loadMethods() : BaseMethodIdMapping;
  
  /**
   * Maps 8-byte method IDs to the ABI of the method that they represent
   */
  protected readonly methodsById: BaseMethodIdMapping;
  
  constructor() {
    this.methodsById = this.loadMethods();
  }
  
  /**
   * Decode the given function call data, returning a readable explanation of the call
   * @param data The data to decode
   * @return An explanation of the call, including the function name and arguments passed
   */
  abstract decode(data: Buffer): BaseFunctionCallExplanation;
}
