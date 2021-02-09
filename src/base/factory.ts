import { Contract } from './contracts/contracts';
import { Decoder } from './decoder/decoder';

/**
 * This gives the user the ability to get contract and decoder instances for each supported chain
 */
export interface Factory<TContract extends Contract<any>, TDecoder extends Decoder<any>> {
  getContract(name: string): TContract;
  getDecoder(): TDecoder;
  listContractTypes(): string[];
}
