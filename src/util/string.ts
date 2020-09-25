export function stripHexPrefix(data: string): string {
  if (data.startsWith('0x')) {
    return data.slice(2);
  }
  return data;
}
