import * as path from 'path';
import * as fs from 'fs';
import { ensure } from '../../util/ensure';
import { isValidJSON } from '../../util/json';
import { ContractABI, MethodABI, Parameter } from '../../eth/contract/json';

// import { MethodContainerMap, MethodManager } from '../method/manager';

/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export abstract class BaseDecoder {

 /**
   * Read in and parse all methods from all defined contract abis
   * @return A mapping of method IDs (in hex string format) to the method ID object
   */
  protected abstract loadMethods() : MethodIdMapping;
  
  /**
   * Maps 8-byte method IDs to the ABI of the method that they represent
   */
  protected readonly methodsById: MethodIdMapping;
  
  constructor() {
    this.methodsById = this.loadMethods();
  }
  
  /**
   * Decode the given function call data, returning a readable explanation of the call
   * @param data The data to decode
   * @return An explanation of the call, including the function name and arguments passed
   */
  abstract decode(data: Buffer): FunctionCallExplanation;

}


interface MethodData {
  abi: MethodABI;
  contractName: string;
}

interface MethodIdMapping {
    [key: string]: MethodData;
}

interface FunctionArgument extends Parameter {
    value: any;
}

export interface FunctionCallExplanation {
    methodId: string;
    contractName: string;
    name: string;
    args: FunctionArgument[];
}

