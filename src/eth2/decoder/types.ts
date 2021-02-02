import { addHexPrefix, bufferToHex } from 'ethereumjs-util';
import { formatBool, isArray, parseArraySubType, parsePrimitive, Primitive } from '../../base2/decoder/types';
import { BigNumber } from 'bignumber.js';

function formatArray(values: any[], subtype: string): any[] {
  return values.map((value) => formatValue(value, subtype));
}

/**
 * Format values of different types
 * @param value The value to format
 * @param type The solidity type string of the value
 * @return The formatted value
 */
export function formatValue(value: any, type: string): any {
  if (isArray(type)) {
    return formatArray(value, parseArraySubType(type));
  } else {
    switch (parsePrimitive(type)) {
      case Primitive.Address:
        return addHexPrefix(value);
      case Primitive.Bool:
        return formatBool(value);
      case Primitive.Bytes:
        return bufferToHex(value);
      case Primitive.Int:
        // value is a Buffer
        const bigNumberValue = new BigNumber(value.toString('hex'), 16);
        return bigNumberValue.toFixed();
      case Primitive.String:
        return value.toString();
    }
  }
}
