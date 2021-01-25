import { BaseFunctionCallExplanation, BaseMethodData, BaseMethodIdMapping } from "../../base/decoder/iface";
import { EthMethodABI, EthParameter} from "../../base/iface";


export interface MethodData extends BaseMethodData {
  abi: EthMethodABI;
}

export interface MethodIdMapping extends BaseMethodIdMapping {
    [key: string]: MethodData;
}

export interface FunctionArgument extends EthParameter {
    value: any;
  }

export interface FunctionCallExplanation extends BaseFunctionCallExplanation {
  args: FunctionArgument[];
}