"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function stripHexPrefix(data) {
    if (data.startsWith('0x')) {
        return data.slice(2);
    }
    return data;
}
exports.stripHexPrefix = stripHexPrefix;
//# sourceMappingURL=string.js.map