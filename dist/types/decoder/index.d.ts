/// <reference types="node" />
import { Parameter } from '../contract/json';
/**
 * A class to decode contract calls and explain their purpose
 */
export declare class Decoder {
    /**
     * Read in and parse all methods from all defined contract abis
     * @return A mapping of method IDs (in hex string format) to the method ID object
     */
    private static loadMethods;
    /**
     * Maps 8-byte method IDs to the ABI of the method that they represent
     */
    private readonly methodsById;
    constructor();
    /**
     * Decode the given function call data, returning a readable explanation of the call
     * @param data The data to decode
     * @return An explanation of the call, including the function name and arguments passed
     */
    decode(data: Buffer): FunctionCallExplanation;
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
export {};
