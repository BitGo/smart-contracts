"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const abi = __importStar(require("ethereumjs-abi"));
const ethUtil = __importStar(require("ethereumjs-util"));
const ensure_1 = require("../../util/ensure");
class Method {
    constructor(methodAbi) {
        this.definition = methodAbi;
    }
    /**
     * Get the name of this function
     */
    getName() {
        return this.definition.name;
    }
    /**
     * Build a method call using the loaded ABI
     */
    call(params) {
        const types = [];
        const values = [];
        this.definition.inputs.forEach((input) => {
            ensure_1.ensure(params[input.name] !== undefined, `Missing required parameter: ${input.name}`);
            values.push(params[input.name]);
            types.push(input.type);
        });
        return {
            data: ethUtil.addHexPrefix(this.getMethodId() + abi.rawEncode(types, values).toString('hex')),
            amount: '0',
        };
    }
    /**
     * Get the Method ID of this method. This defines the first 4 bytes of the transaction data to call the method
     */
    getMethodId() {
        return abi.methodID(this.getName(), this.definition.inputs.map((input) => input.type)).toString('hex');
    }
    /**
     * Get the JSON ABI definition of this method
     */
    explain() {
        return this.definition;
    }
}
exports.Method = Method;
//# sourceMappingURL=index.js.map