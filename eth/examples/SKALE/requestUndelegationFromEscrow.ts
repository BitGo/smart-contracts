import { BitGo } from 'bitgo';
import { getContractsFactory } from '../../../src/index';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  const proxyAddress = '0xB575c158399227b6ef4Dcfb05AA3bCa30E12a7ba';
  const Allocator = getContractsFactory('eth').getContract('SkaleAllocator').instance();
  Allocator.address = proxyAddress;

  /**
   * Get the Escrow wallet address that is linked to the delegator's Bitgo wallet address
   */
  let { data, amount } = Allocator.methods().getEscrowAddress.call({
    beneficiary: bitGoWallet.getAddress(),
  });
  const escrowAddress = await bitGoWallet.send({ data, amount, address: Allocator.address, walletPassphrase });

  //Retrieve Escrow contract for delegator
  const Escrow = getContractsFactory('eth').getContract('SkaleEscrow').instance();
  Escrow.address = escrowAddress;

  //parameter for the id of the undelegation request
  const idOfDelegation = 'ID of delegation to undelegate';


  /**
   * Request to undelegate from the delegator's Escrow account.
   *
   * After the epoch starts all delegations that are accepted turns to DELEGATED state.
   * Token holders (delegators) can request undelegation once the delegation is in the DELEGATED state
   * But only their delegations will be “undelegated” once their delegation period is over.
   */
  ({ data, amount } = Escrow.methods().requestUndelegation.call({
    delegationId: idOfDelegation,
  }));
  const transaction = await bitGoWallet.send({ data, amount, address: Escrow.address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
