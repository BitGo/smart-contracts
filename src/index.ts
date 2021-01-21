import { baseContractFactory } from './base/baseContractFactory';
import * as Eth from './eth';
export { Eth };
import * as Trx from './trx';
export { Trx };


const factoryMap : any = {
  eth: Eth.contractFactory,
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
export function getContractsFactory(chainName: string): baseContractFactory {
  const factoryClass = factoryMap[chainName];
  if (!factoryClass) {
    throw new Error(`Coin ${chainName} not supported`);
  }

  return new factoryClass();
}
