export abstract class baseContractFactory {
  // @ts-ignore make generic
  public abstract listContractTypes();
  
  // @ts-ignore make generic
  public abstract getContract(contractName: string);

  // @ts-ignore make generic
  public abstract getDecoder();

}
