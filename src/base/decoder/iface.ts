import { Parameter, MethodABI } from "../iface";


export interface BaseMethodData {
  abi: MethodABI;
  contractName: string;
}

export interface BaseMethodIdMapping {
  [key: string]: BaseMethodData;
}

export interface BaseFunctionArgument extends Parameter {
  value: any;
}

export interface BaseFunctionCallExplanation {
  methodId: string;
  contractName: string;
  name: string;
  args: BaseFunctionArgument[];
}

