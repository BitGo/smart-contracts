export interface Decoder<T extends CallExplanation> {
  decode(data: Buffer): T;
}

export class EthDecoder implements Decoder<FunctionCallExplanation> {
  decode(data: Buffer): FunctionCallExplanation {
    throw Error('Unimplemented');
  }

}

export interface CallExplanation {
  methodId: string;
  contractName: string;
  name: string;
}

export interface FunctionCallExplanation extends CallExplanation {
  args: any[];
}

