import { MethodABI } from './json';
import { MethodContainerMap } from './method/manager';
/**
 * A high-level wrapper for Solidity smart contract function calls
 */
export declare class Contract {
    static readonly ABI_DIR = "../../abis";
    static readonly CONFIG_DIR = "../../config";
    static readonly DEFAULT_INSTANCE_KEY = "default";
    /**
     * List the names of the available ABI definitions.
     * These are stored locally as JSON ABI definition files
     */
    static listContractTypes(): string[];
    /**
     * Read in and parse an ABI file
     * @param contractName The name of the contract to read the file from
     *  There must be a file with this name locally, otherwise this function will throw
     */
    private static readContractAbi;
    /**
     * Read in and parse config for instances of this contract type
     * @param contractName The name of the contract to read the config for
     */
    private static readContractInstances;
    /**
     * Internal list of contract method definitions
     */
    private readonly methodDefinitions;
    /**
     * The name of this contract type
     */
    private readonly contractName;
    /**
     * Address of the contract instance
     */
    private readonly contractInstances;
    /**
     * Address of the contract instance
     */
    private instanceAddress;
    constructor(contractName: string);
    /**
     * Public mapping from method name to function call builder
     */
    methods(): MethodContainerMap;
    /**
     * Getter to list the available methods for a given contract
     */
    listMethods(): MethodABI[];
    /**
     * Get the name of this contract type
     */
    getName(): string;
    /**
     * Get the address of this instance
     */
    getAddress(): string;
    /**
     * Set the instance address for this contract to the given address
     * @param address The address to set it to
     */
    address(address: string): Contract;
    /**
     * Set the instance address for this contract by name
     * @param name The name of the deployed contract to set the address for
     */
    instance(name: string): Contract;
}
export interface ContractInstances {
    [key: string]: string;
}
export { MethodResponse } from './method';
