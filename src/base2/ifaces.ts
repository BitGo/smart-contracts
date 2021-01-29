import { Contract, EthContract } from './contracts/contracts';

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

export interface Factory<T extends Contract<any>, D extends Decoder<any>> {
  getContract(name: string): T;
  getDecoder(): D;
}


export class EthFactory implements Factory<EthContract, EthDecoder> {
  getContract(name: string): EthContract {
    return new EthContract(name);
  }

  getDecoder(): Decoder<FunctionCallExplanation> {
    return new EthDecoder();
  }

}
