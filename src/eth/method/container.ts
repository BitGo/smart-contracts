
import { BaseMethodContainer } from '../../base/method/baseContainer';
import { Method, MethodResponse } from './method';
import { EthMethodABI, Parameter } from '../../base/iface';
export class MethodContainer extends BaseMethodContainer<EthMethodABI> {
  /** @inheritdoc */
  call(args: { [key: string]: any }): MethodResponse {
    const closeMatchMethods: Method[] = [];
    const badMatchMethods: Method[] = [];

    // Separate the methods that define each given argument as a parameter from those that don't
    this.methods.forEach((method: Method) => {
      const inputNames = method.explain().inputs.map((input: Parameter) => input.name);
      const givenButUndefined = Object.keys(args).filter((paramName: string) => inputNames.includes(paramName));
      if (givenButUndefined.length > 1) {
        badMatchMethods.push(method);
      } else {
        closeMatchMethods.push(method);
      }
    });

    // Return the response for the first method that doesn't throw

    // Try all of the methods with closely matching parameters first, then the poorly matching ones
    let err;
    for (const method of closeMatchMethods.concat(badMatchMethods)) {
      try {
        return Object.assign(method.call(args), { address: this.address });
      } catch (e) {
        // expected if we have non-matching params
        err = e;
      }
    }

    // If none of them work, throw the parse error from any of them
    throw err;
  }
}
