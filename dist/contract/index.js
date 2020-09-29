"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const ensure_1 = require("../util/ensure");
const json_1 = require("../util/json");
const manager_1 = require("./method/manager");
/**
 * A high-level wrapper for Solidity smart contract function calls
 */
class Contract {
    constructor(contractName) {
        this.contractName = contractName;
        this.contractInstances = Contract.readContractInstances(this.contractName);
        if (this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]) {
            this.address(this.contractInstances[Contract.DEFAULT_INSTANCE_KEY]);
        }
        const contractAbi = Contract.readContractAbi(this.contractName);
        const functions = contractAbi.filter((functionDefinition) => functionDefinition.type === 'function');
        this.methodDefinitions = new manager_1.MethodManager(functions);
    }
    /**
     * List the names of the available ABI definitions.
     * These are stored locally as JSON ABI definition files
     */
    static listContractTypes() {
        return fs.readdirSync(path.join(__dirname, Contract.ABI_DIR)).map((fileName) => {
            ensure_1.ensure(fileName.endsWith('.json'), `Malformed JSON abi filename: ${fileName}`);
            return fileName.replace('.json', '');
        });
    }
    /**
     * Read in and parse an ABI file
     * @param contractName The name of the contract to read the file from
     *  There must be a file with this name locally, otherwise this function will throw
     */
    static readContractAbi(contractName) {
        ensure_1.ensure(Contract.listContractTypes().includes(contractName), `Unknown contract: ${contractName}`);
        const jsonAbi = fs.readFileSync(path.join(__dirname, `${Contract.ABI_DIR}/${contractName}.json`), 'utf-8');
        ensure_1.ensure(json_1.isValidJSON(jsonAbi), `Invalid JSON: ${jsonAbi}`);
        return JSON.parse(jsonAbi);
    }
    /**
     * Read in and parse config for instances of this contract type
     * @param contractName The name of the contract to read the config for
     */
    static readContractInstances(contractName) {
        const config = fs.readFileSync(require.resolve(`${Contract.CONFIG_DIR}/instances.json`), 'utf-8');
        ensure_1.ensure(json_1.isValidJSON(config), `Invalid JSON: ${config}`);
        const parsedConfig = JSON.parse(config);
        ensure_1.ensure(parsedConfig[contractName], `Unknown contract: ${contractName}`);
        // Save them with the instance names lowercased, for easier lookup
        const result = {};
        Object.keys(parsedConfig[contractName]).forEach((instanceName) => {
            result[instanceName.toLowerCase()] = parsedConfig[contractName][instanceName];
        });
        return result;
    }
    /**
     * Public mapping from method name to function call builder
     */
    methods() {
        return this.methodDefinitions.getCallMap(this.instanceAddress);
    }
    /**
     * Getter to list the available methods for a given contract
     */
    listMethods() {
        return this.methodDefinitions.explain();
    }
    /**
     * Get the name of this contract type
     */
    getName() {
        return this.contractName;
    }
    /**
     * Get the address of this instance
     */
    getAddress() {
        ensure_1.ensure(this.instanceAddress, `Instance address not set: ${this.instanceAddress}`);
        return this.instanceAddress;
    }
    /**
     * Set the instance address for this contract to the given address
     * @param address The address to set it to
     */
    address(address) {
        this.instanceAddress = address.toLowerCase();
        return this;
    }
    /**
     * Set the instance address for this contract by name
     * @param name The name of the deployed contract to set the address for
     */
    instance(name) {
        name = name.toLowerCase();
        ensure_1.ensure(this.contractInstances[name], `Unknown instance: ${name}`);
        this.instanceAddress = this.contractInstances[name];
        return this;
    }
}
Contract.ABI_DIR = '../../abis';
Contract.CONFIG_DIR = '../../config';
Contract.DEFAULT_INSTANCE_KEY = 'default';
exports.Contract = Contract;
//# sourceMappingURL=index.js.map