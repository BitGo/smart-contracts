
export interface Decoder<TCallExplanation extends CallExplanation> {
  decode(data: Buffer): TCallExplanation;
}

export interface CallExplanation {
  methodId: string;
  contractName: string;
  name: string;
}

export interface FunctionCallExplanation extends CallExplanation {
  args: any[];
}
