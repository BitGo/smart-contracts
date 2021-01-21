import { BitGo } from 'bitgo';
import { getContractsFactory } from '../../../src/index';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  //parameter for the id of the undelegation request
  const idOfDelegation = 'ID of delegation to undelegate';

  const proxyAddress = '0x06dD71dAb27C1A3e0B172d53735f00Bf1a66Eb79';
  const DelegationController = getContractsFactory('eth').getContract('SkaleDelegationController').address(proxyAddress);

  /**
   * After the epoch starts all delegations that are accepted turns to DELEGATED state.
   * Token holders (delegators) can request undelegation once the delegation is in the DELEGATED state
   * But only their delegations will be “undelegated” once their delegation period is over.
   */
  const { data, amount, address } = DelegationController.methods().requestUndelegation.call({
    delegationId: idOfDelegation,
  });
  const transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
