export type ContractABI = MethodABI[];
export type EthContractABI = EthMethodABI[];
export type TrxContractABI = TrxMethodABI[];


export interface MethodABI {
  name: string;
  type: string;
}

export interface Parameter {
  name: string;
  type: string;
}

export interface EthMethodABI extends MethodABI {
  constant: boolean;
  payable: boolean;
  inputs: Parameter[];
  outputs?: Parameter[];
}

export interface TrxMethodABI extends MethodABI {
  constant?: boolean;
  payable?: boolean;
  inputs?: Parameter[];
  outputs?: Parameter[];
}