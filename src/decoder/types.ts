import { bufferToHex, bufferToInt, addHexPrefix } from 'ethereumjs-util';
import BigNumber from 'bignumber.js';
import { ensure } from '../util/ensure';

enum Primitive {
    Address,
    Bool,
    String,
    Bytes,
    Int,
}

function formatBool(value: Buffer): boolean {
  const intBool = bufferToInt(value);
  return intBool === 1;
}

function formatArray(values: any[], subtype: string): any[] {
  return values.map((value) => formatValue(value, subtype));
}

function isArray (type: string): boolean {
  return type.lastIndexOf(']') === type.length - 1;
}

/**
 * Take a type string, such as uint256, and return the primitive value type that it represents
 * @param type The type to parse
 * @return The primitive value type
 * @throws if the type is unknown
 */
function parsePrimitive(type: string): Primitive {
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
function parseArraySubType(type: string): string {
  ensure(isArray(type), 'Invalid type, not an array');
  return type.slice(0, type.lastIndexOf('['));
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
