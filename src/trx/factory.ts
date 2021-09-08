import { TrxContract } from './contracts/contracts';
import { listContractTypes } from '../base/contracts/contractInstances';

import { TrxDecoder } from './decoder/decoder';
import { Factory } from '../base/factory';

export class TrxFactory implements Factory<TrxContract, TrxDecoder> {
  getContract(name: string): TrxContract {
    return new TrxContract(name);
  }

  getDecoder(): TrxDecoder {
    return new TrxDecoder();
  }

  listContractTypes(): string[] {
    return listContractTypes(TrxContract.chainName);
  }
}
