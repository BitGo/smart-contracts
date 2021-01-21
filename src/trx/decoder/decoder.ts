import { TrxContractABI } from '../../base/iface';
import { BaseDecoder } from '../../base/decoder/baseDecoder';
import { FunctionCallExplanation, MethodIdMapping } from './iface';

/** @inheritdoc */
export class Decoder extends BaseDecoder<MethodIdMapping, FunctionCallExplanation, TrxContractABI> {
  /** @inheritdoc */
  protected loadMethods(): MethodIdMapping {
    throw new Error('Method not implemented');
  }

  protected readonly methodsById: MethodIdMapping;

  constructor() {
    super();
  }

  /** @inheritdoc */
  public decode(data: Buffer): FunctionCallExplanation {
    throw new Error('Method not implemented');
  }
}
