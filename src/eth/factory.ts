import { EthContract } from './contracts/contracts';
import { listContractTypes } from '../base/contracts/contractInstances';

import { EthDecoder } from './decoder/decoder';
import { Factory } from '../base/factory';

export class EthFactory implements Factory<EthContract, EthDecoder> {
  getContract(name: string): EthContract {
    return new EthContract(name);
  }

  getDecoder(): EthDecoder {
    return new EthDecoder();
  }

  listContractTypes(): string[] {
    return listContractTypes(EthContract.chainName);
  }
}
