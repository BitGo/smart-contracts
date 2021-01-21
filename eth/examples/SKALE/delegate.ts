import { BitGo } from 'bitgo';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  //parameters needed for the delegation request
  const idOfValidator = 'validator id';
  const amounttoDelegate = 'amount of proposed delegation';
  const proposedDelegationPeriod = 'period of proposed delegation (3months)';
  const descriptionAboutDelegation = 'description or summary about the delegation';

  const proxyAddress = '0x06dD71dAb27C1A3e0B172d53735f00Bf1a66Eb79';
  const DelegationController = new Contract('SkaleDelegationController').address(proxyAddress);

  /**
   * Sending a proposal to delegate SKL tokens to the validator.
   */
  const { data, amount, address } = DelegationController.methods().delegate.call({
    validatorId: idOfValidator,
    amount: amounttoDelegate,
    delegationPeriod: proposedDelegationPeriod,
    info: descriptionAboutDelegation,
  });
  const transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
