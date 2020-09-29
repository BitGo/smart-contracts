import { MethodABI } from '../json';
export declare class Method {
    private readonly definition;
    constructor(methodAbi: MethodABI);
    /**
     * Get the name of this function
     */
    getName(): string;
    /**
     * Build a method call using the loaded ABI
     */
    call(params: {
        [key: string]: any;
    }): MethodResponse;
    /**
     * Get the Method ID of this method. This defines the first 4 bytes of the transaction data to call the method
     */
    getMethodId(): string;
    /**
     * Get the JSON ABI definition of this method
     */
    explain(): MethodABI;
}
/**
 * The response from a method call. This at least includes the transaction data required to call this method
 */
export interface MethodResponse {
    data: string;
    address?: string;
    amount?: string;
}
