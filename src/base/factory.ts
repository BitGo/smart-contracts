import { Contract } from './contracts/contracts';
import { Decoder } from './decoder/decoder';

/**
 * This gives the user the ability to get contract and decoder instances for each supported chain
 */
export interface Factory<T extends Contract<any>, D extends Decoder<any>> {
  getContract(name: string): T;
  getDecoder(): D;
  listContractTypes(): string[];
}
