import { Decoder, FunctionCallExplanation } from './base2/decoder/decoder';
import * as Eth from './eth';
export { Eth };
import * as Trx from './trx';
import { Contract } from './base2/contracts/contracts';
import { Method } from './base2/methods/methods';
import { EthFactory } from './eth2/factory';
import { Factory } from './base2/factory';
export { Trx };


const factoryMap : any = {
  eth: EthFactory,
  trx: Trx.contractFactory,
};

/**
 * Get the list of coin tickers supported by this library.
 */
export const supportedCoins = Object.keys(factoryMap);

/**
 * Get a transaction builder for the given coin.
 *
 * @param chainName One of the {@code supportedCoins}
 * @returns An instance of a {@code TransactionBuilder}
 */
export function getContractsFactory(chainName: string): Factory<Contract<Method>, Decoder<FunctionCallExplanation>> {
  const factoryClass = factoryMap[chainName];
  if (!factoryClass) {
    throw new Error(`Coin ${chainName} not supported`);
  }

  return new factoryClass();
}

