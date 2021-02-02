
export interface Decoder<T extends CallExplanation> {
  decode(data: Buffer): T;
}

export interface CallExplanation {
  methodId: string;
  contractName: string;
  name: string;
}

export interface FunctionCallExplanation extends CallExplanation {
  args: any[];
}
