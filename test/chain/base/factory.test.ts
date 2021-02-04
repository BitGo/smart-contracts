import { getContractsFactory, supportedCoins } from '../../../src';
const expect = require('expect');

describe('Factory tests', () => {

  it('Should create an factory instance for each supported chain', () => {
    supportedCoins.forEach(chainName => {
      const contract = getContractsFactory(chainName);
      expect(contract).toBeDefined();
    });
  });

  it('Should fail to create an factory instance for unsupported chain', () => {
    expect(() => getContractsFactory('unsupportedChain')).toThrowError('Coin unsupportedChain not supported');
  });
});
