import { BaseContract } from "./contracts/baseContract";
import { BaseDecoder } from "./decoder/baseDecoder";

export abstract class baseContractFactory {
  /**
   * Returns a specific Contract
   * @param {string} contractName Contract type, this match with the config/instances.json file
   * @returns {BaseContract}
   */
  public abstract getContract(contractName: string): BaseContract;

  /**
   * Returns a specific Decoder
   * @returns {BaseDecoder}
   */
  public abstract getDecoder() : BaseDecoder;
}



