export type ContractABI = MethodABI[];
export type EthContractABI = EthMethodABI[];
export type TrxContractABI = TrxMethodABI[];


export interface MethodABI {
  name: string;
  type: string;
}

export interface Parameter {
  type: string;
}

export interface EthMethodABI extends MethodABI {
  constant: boolean;
  payable: boolean;
  inputs: EthParameter[];
  outputs?: EthParameter[];
}

export interface EthParameter extends Parameter {
  name: string;
}

export interface TrxMethodABI extends MethodABI {
  constant?: boolean;
  payable?: boolean;
  inputs?: TrxParameter[];
  outputs?: TrxParameter[];
}

export interface TrxParameter extends Parameter {
  name?: string;
}
