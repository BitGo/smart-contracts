import { BitGo } from 'bitgo';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  //parameters needed for withdrawing bounties
  const idOfValidator = 'validator id';
  const addressOfReceivingDelegator = 'token holder address';

  const proxyAddress = '0x4eE5F270572285776814e32952446e9B7Ee15C86';
  const Distributor = new Contract('SkaleDistributor').address(proxyAddress);

  /**
     * Allows token holder (delegator) to withdraw bounty from a specific validator.
     * This needs to be called per validator in order to recieve all of the bounties.
     */
  const { data, amount, address } = Distributor.methods().withdrawBounty.call({
    validatorId: idOfValidator,
    address: addressOfReceivingDelegator,
  });
  const transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
