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

  //parameters needed for withdrawing bounties
  const idOfValidator = 'validator id';

  /**
   * Withdraw bounty for delegator's Escrow account.
   *
   * Allows token holder (delegator) to withdraw bounty from a specific validator.
   * This needs to be called per validator in order to recieve all of the bounties.
   */
  ({ data, amount } = Escrow.methods().withdrawBounty.call({
    validatorId: idOfValidator,
    address: bitGoWallet.getAddress(),
  }));
  const transaction = await bitGoWallet.send({ data, amount, address: Escrow.address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
