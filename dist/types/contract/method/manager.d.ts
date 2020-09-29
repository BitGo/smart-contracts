import { MethodABI } from '../json';
import { MethodContainer } from './container';
/**
 * Manages all of the methods for a given contract
 */
export declare class MethodManager {
    private readonly methods;
    constructor(methodAbis: MethodABI[]);
    /**
     * Get mapping from method names to function call builders for them
     * @param [instanceAddress] the deployed address for this contract
     */
    getCallMap(instanceAddress?: string): MethodContainerMap;
    /**
     * Describe the interfaces for all methods
     */
    explain(): MethodABI[];
}
export interface MethodContainerMap {
    [key: string]: MethodContainer;
}
