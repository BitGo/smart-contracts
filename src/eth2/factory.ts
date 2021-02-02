import { EthContract } from './contracts/contracts';
import { EthDecoder } from './decoder/decoder';
import { Factory } from '../base2/factory';
export class EthFactory implements Factory<EthContract, EthDecoder> {
  getContract(name: string): EthContract {
    return new EthContract(name);
  }

  getDecoder(): EthDecoder {
    return new EthDecoder();
  }
}
