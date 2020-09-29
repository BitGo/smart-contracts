"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ethereumjs_util_1 = require("ethereumjs-util");
const ensure_1 = require("../util/ensure");
var Primitive;
(function (Primitive) {
    Primitive[Primitive["Address"] = 0] = "Address";
    Primitive[Primitive["Bool"] = 1] = "Bool";
    Primitive[Primitive["String"] = 2] = "String";
    Primitive[Primitive["Bytes"] = 3] = "Bytes";
    Primitive[Primitive["Int"] = 4] = "Int";
})(Primitive || (Primitive = {}));
function formatBool(value) {
    const intBool = ethereumjs_util_1.bufferToInt(value);
    return intBool === 1;
}
function formatArray(values, subtype) {
    return values.map((value) => formatValue(value, subtype));
}
function isArray(type) {
    return type.lastIndexOf(']') === type.length - 1;
}
/**
 * Take a type string, such as uint256, and return the primitive value type that it represents
 * @param type The type to parse
 * @return The primitive value type
 * @throws if the type is unknown
 */
function parsePrimitive(type) {
    if (type.includes('address')) {
        return Primitive.Address;
    }
    if (type.includes('bool')) {
        return Primitive.Bool;
    }
    if (type.includes('string')) {
        return Primitive.String;
    }
    if (type.includes('bytes')) {
        return Primitive.Bytes;
    }
    if (type.includes('int')) {
        return Primitive.Int;
    }
    throw new Error(`Unknown type ${type}`);
}
/**
 * Take an array type and return the subtype that it is an array of
 * i.e. uint256[][] would return uint256[], and uint256[] would return uint256
 * @param type The type to parse subarray from
 * @return The subarray type
 */
function parseArraySubType(type) {
    ensure_1.ensure(isArray(type), 'Invalid type, not an array');
    return type.slice(0, type.lastIndexOf('['));
}
/**
 * Format values of different types
 * @param value The value to format
 * @param type The solidity type string of the value
 * @return The formatted value
 */
function formatValue(value, type) {
    if (isArray(type)) {
        return formatArray(value, parseArraySubType(type));
    }
    else {
        switch (parsePrimitive(type)) {
            case Primitive.Address:
                return ethereumjs_util_1.addHexPrefix(value);
            case Primitive.Bool:
                return formatBool(value);
            case Primitive.Bytes:
                return ethereumjs_util_1.bufferToHex(value);
            case Primitive.Int:
                return ethereumjs_util_1.bufferToInt(value);
            case Primitive.String:
                return value.toString();
        }
    }
}
exports.formatValue = formatValue;
//# sourceMappingURL=types.js.map