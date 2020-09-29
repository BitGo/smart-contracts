import { MethodABI } from '../json';
import { Method, MethodResponse } from './';
/**
 * Wrapper class for methods with the same name
 * Since methods can overload each other, we need this to be able to call methods by name and
 *   intelligently determine the correct one to call by parameter
 */
export declare class MethodContainer {
    private readonly methods;
    private address;
    constructor();
    /**
     * Add a method to this container
     * @param method The method to add
     */
    add(method: Method): void;
    /**
     * Set the instance address of this deployed contract
     * @param address The address to set
     */
    setAddress(address: string): void;
    /**
     * Describe the interface for methods
     */
    explain(): MethodABI[];
    /**
     * Call this method with the given parameters
     * @param args Solidity parameters to call the method with
     */
    call(args: {
        [key: string]: any;
    }): MethodResponse;
}
