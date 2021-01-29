import { Contract } from './contracts/contracts';
import { Decoder } from './ifaces';

export interface Factory<T extends Contract<any>, D extends Decoder<any>> {
  getContract(name: string): T;
  getDecoder(): D;
}
