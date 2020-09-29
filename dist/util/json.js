"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isValidJSON(str) {
    try {
        JSON.parse(str);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.isValidJSON = isValidJSON;
//# sourceMappingURL=json.js.map