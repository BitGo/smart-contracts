import { BaseDecoder } from '../../base/decoder/baseDecoder';
import { FunctionCallExplanation, MethodIdMapping } from './iface';


/** @inheritdoc */
export class Decoder extends BaseDecoder {
  /** @inheritdoc */
  protected loadMethods(): MethodIdMapping {
    throw new Error('Method not implemented.');
  }

  /** @inheritdoc */
  protected readonly methodsById: MethodIdMapping;

  constructor() {
    super();
  }

  /** @inheritdoc */
  decode(data: Buffer): FunctionCallExplanation {
    throw new Error('Method not implemented.');
  }
}
