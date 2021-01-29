import { EthContract } from './contracts/contracts';
import { Decoder, EthDecoder, FunctionCallExplanation } from '../base2/ifaces';
import { Factory } from '../base2/factory';

export class EthFactory implements Factory<EthContract, EthDecoder> {
  getContract(name: string): EthContract {
    return new EthContract(name);
  }

  getDecoder(): Decoder<FunctionCallExplanation> {
    return new EthDecoder();
  }
}
