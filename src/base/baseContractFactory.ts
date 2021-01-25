import { BaseContract } from "./contracts/baseContract";



export abstract class baseContractFactory {
  protected readonly _chainName: string;

  protected constructor(_chainName: string) {
    this._chainName = _chainName;
  }

  public abstract getContract(chainName: string): BaseContract;

  public abstract getDecoder() : any;

}



