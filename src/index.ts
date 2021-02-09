import { Decoder, FunctionCallExplanation } from './base/decoder/decoder';
import { Contract } from './base/contracts/contracts';
import { Method } from './base/methods/methods';
import { EthFactory } from './eth/factory';
import { TrxFactory } from './trx/factory';
import { Factory } from './base/factory';


const factoryMap : any = {
  eth: EthFactory,
  trx: TrxFactory,
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

