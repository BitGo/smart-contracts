export type ContractABI = MethodABI[];

export interface MethodABI {
  constant: boolean;
  payable: boolean;
  name: string;
  type: string;
  inputs: Parameter[];
  outputs?: Parameter[];
}

export interface Parameter {
  name: string;
  type: string;
}