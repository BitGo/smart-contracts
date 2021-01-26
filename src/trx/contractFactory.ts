import { baseContractFactory } from "../base/baseContractFactory";
import { Contract } from './contract/contract';
import { Decoder } from "./decoder/decoder";


export class contractFactory extends baseContractFactory {
  /** @inheritdoc */
  getContract(contractName: string): Contract {
    return new Contract(contractName);
  }

  /** @inheritDoc */
  getDecoder(): Decoder {
    return new Decoder()
  }
}
