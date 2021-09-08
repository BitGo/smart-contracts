import { bufferToInt } from 'ethereumjs-util';
import { ensure } from '../../util/ensure';


export enum Primitive {
    Address,
    Bool,
    String,
    Bytes,
    Int,
}

export function formatBool(value: Buffer): boolean {
  const intBool = bufferToInt(value);
  return intBool === 1;
}

export function isArray (type: string): boolean {
  return type.includes('[]') && type.lastIndexOf(']') === type.length - 1;
}

export function isHex(data: string): boolean {
  return /^([0-9a-f])+$/.test(data);
}

/**
 * Take an array type and return the subtype that it is an array of
 * i.e. uint256[][] would return uint256[], and uint256[] would return uint256
 * @param type The type to parse subarray from
 * @return The subarray type
 */
export function parseArraySubType(type: string): string {
  ensure(isArray(type), 'Invalid type, not an array');
  return type.slice(0, type.lastIndexOf('['));
}


/**
 * Take a type string, such as uint256, and return the primitive value type that it represents
 * @param type The type to parse
 * @return The primitive value type
 * @throws if the type is unknown
 */
export function parsePrimitive(type: string): Primitive {
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
