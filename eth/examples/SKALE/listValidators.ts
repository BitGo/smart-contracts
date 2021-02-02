import { BitGo } from 'bitgo';
import { getContractsFactory } from '../../../src/index2';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  const proxyAddress = '0x840C8122433A5AA7ad60C1Bcdc36AB9DcCF761a5';
  const ValidatorService = getContractsFactory('eth').getContract('SkaleValidatorService').instance();
  ValidatorService.address = proxyAddress;

  /**
   * List all of the trusted validators that are registered within the SKALE Network.
   */
  const { data, amount } = ValidatorService.methods().getTrustedValidators.call({});
  const transaction = await bitGoWallet.send({ data, amount, address: ValidatorService.address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
