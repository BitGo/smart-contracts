export type ContractABI = MethodABI[];
export type EthContractABI = EthMethodABI[];

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