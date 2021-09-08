import { isHex } from '../base/decoder/types';

export function stripHexPrefix(data: string): string {
  if (data.startsWith('0x')) {
    return data.slice(2);
  }
  return data;
}

export function parseToBuffer(data: string): Buffer {
  let bufferData : Buffer;
  data = stripHexPrefix(data);
  if (isHex(data)) {
    bufferData = Buffer.from(data, 'hex');
  } else {
    throw new Error('String data is not on hex format');
  }
  return bufferData;
}
