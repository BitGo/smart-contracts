import { baseContractFactory } from '../base/baseContractFactory';
import { Contract } from './contract/contract';
import { Decoder } from './decoder/decoder';


export class contractFactory extends baseContractFactory {
  /** @inheritdoc */
  listContractTypes() {
    throw new Error('Trx Contract not implemented');
  }
  /** @inheritdoc */
  getContract(contractName: string): Contract {
    throw new Error('Trx Contract not implemented');
  }

  /** @inheritDoc */
  getDecoder(): Decoder {
    throw new Error('Trx Decoder not implemented');
  }
}
