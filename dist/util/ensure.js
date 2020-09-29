"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks if `test` is truthy. If it is not, then throw with the given message
 * @param test The object to check for truthiness
 * @param msg The message to throw if `test` is falsy
 */
function ensure(test, msg) {
    if (!test) {
        throw new Error(msg);
    }
}
exports.ensure = ensure;
//# sourceMappingURL=ensure.js.map