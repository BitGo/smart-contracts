"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_abi_1 = require("ethereumjs-abi");
const ethereumjs_util_1 = require("ethereumjs-util");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const types_1 = require("./types");
const contract_1 = require("../contract");
const ensure_1 = require("../util/ensure");
const json_1 = require("../util/json");
/**
 * A class to decode contract calls and explain their purpose
 */
class Decoder {
    /**
     * Read in and parse all methods from all defined contract abis
     * @return A mapping of method IDs (in hex string format) to the method ID object
     */
    static loadMethods() {
        const result = {};
        for (const contractName of contract_1.Contract.listContractTypes()) {
            const abi = fs.readFileSync(path.join(__dirname, `${contract_1.Contract.ABI_DIR}/${contractName}.json`), 'utf-8');
            ensure_1.ensure(json_1.isValidJSON(abi), `Invalid JSON: ${abi}`);
            const jsonAbi = JSON.parse(abi);
            for (const methodAbi of jsonAbi) {
                if (methodAbi.inputs) {
                    const name = methodAbi.name;
                    const types = methodAbi.inputs.map((input) => input.type);
                    const methodIdString = ethereumjs_util_1.bufferToHex(ethereumjs_abi_1.methodID(name, types));
                    result[methodIdString] = { contractName, abi: methodAbi };
                }
            }
        }
        return result;
    }
    constructor() {
        this.methodsById = Decoder.loadMethods();
    }
    /**
     * Decode the given function call data, returning a readable explanation of the call
     * @param data The data to decode
     * @return An explanation of the call, including the function name and arguments passed
     */
    decode(data) {
        const methodId = ethereumjs_util_1.bufferToHex(data.slice(0, 4));
        const abiEncodedArguments = data.slice(4);
        ensure_1.ensure(this.methodsById[methodId], `Unknown method: ${methodId}`);
        const { contractName, abi: { name, inputs } } = this.methodsById[methodId];
        const types = inputs.map((input) => input.type);
        const decodedArguments = ethereumjs_abi_1.rawDecode(types, abiEncodedArguments);
        const args = [];
        for (let i = 0; i < inputs.length; i++) {
            const { name, type } = inputs[i];
            const decodedArgument = decodedArguments[i];
            args.push({ name, type, value: types_1.formatValue(decodedArgument, type) });
        }
        return {
            methodId,
            name,
            args,
            contractName,
        };
    }
}
exports.Decoder = Decoder;
//# sourceMappingURL=index.js.map