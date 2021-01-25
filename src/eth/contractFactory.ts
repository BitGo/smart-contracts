import { BaseContract } from "../base/contracts/baseContract";
import { baseContractFactory } from "../base/baseContractFactory";
import { Contract } from '../eth/contract/contract';
import { Decoder } from "./decoder/decoder";


export class contractFactory extends baseContractFactory {
  constructor(_chainName: string) {
    super(_chainName);
  }

  /** @inheritdoc */
  getContract(contractName: string): Contract {
    return new Contract(contractName);
  }

  /** @inheritDoc */
  getDecoder(): Decoder {
    return new Decoder()
  }
}
