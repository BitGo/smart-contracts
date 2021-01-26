import { BaseFunctionCallExplanation, BaseMethodData, BaseMethodIdMapping } from "../../base/decoder/iface";
import { TrxMethodABI, TrxParameter} from "../../base/iface";


export interface MethodData extends BaseMethodData {
  abi: TrxMethodABI;
}

export interface MethodIdMapping extends BaseMethodIdMapping {
    [key: string]: MethodData;
}

export interface FunctionArgument extends TrxParameter {
    value: any;
  }

export interface FunctionCallExplanation extends BaseFunctionCallExplanation {
  args: FunctionArgument[];
}