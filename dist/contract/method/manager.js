"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require("./");
const container_1 = require("./container");
/**
 * Manages all of the methods for a given contract
 */
class MethodManager {
    constructor(methodAbis) {
        this.methods = {};
        methodAbis.map((functionDefinition) => {
            const method = new _1.Method(functionDefinition);
            if (this.methods[method.getName()] === undefined) {
                this.methods[method.getName()] = new container_1.MethodContainer();
            }
            this.methods[method.getName()].add(method);
        });
    }
    /**
     * Get mapping from method names to function call builders for them
     * @param [instanceAddress] the deployed address for this contract
     */
    getCallMap(instanceAddress) {
        // Update the instance address for all methods
        Object.keys(this.methods).forEach((methodName) => {
            const methodContainer = this.methods[methodName];
            if (instanceAddress) {
                methodContainer.setAddress(instanceAddress);
            }
        });
        return this.methods;
    }
    /**
     * Describe the interfaces for all methods
     */
    explain() {
        let result = [];
        Object.keys(this.methods).forEach((methodName) => {
            const methodContainer = this.methods[methodName];
            result = result.concat(methodContainer.explain());
        });
        return result;
    }
}
exports.MethodManager = MethodManager;
//# sourceMappingURL=manager.js.map