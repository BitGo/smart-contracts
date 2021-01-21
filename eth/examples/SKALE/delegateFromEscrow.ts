import { BitGo } from 'bitgo';
import { getContractsFactory } from '../../../src/index';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  const proxyAddress = '0xB575c158399227b6ef4Dcfb05AA3bCa30E12a7ba';
  const Allocator = getContractsFactory('eth').getContract('SkaleAllocator').address(proxyAddress);

  /**
   * Get the Escrow wallet address that is linked to the delegator's Bitgo wallet address
   */
  let { data, amount, address } = Allocator.methods().getEscrowAddress.call({
    beneficiary: bitGoWallet.getAddress(),
  });
  const escrowAddress = await bitGoWallet.send({ data, amount, address, walletPassphrase });

  //Retrieve Escrow contract for delegator
  const Escrow = getContractsFactory('eth').getContract('SkaleEscrow').address(escrowAddress);

  //parameters needed for the delegation request
  const idOfValidator = 'validator id';
  const amounttoDelegate = 'amount of proposed delegation';
  const proposedDelegationPeriod = 'period of proposed delegation (3months)';
  const descriptionAboutDelegation = 'description or summary about the delegation';

    
  /**
   * Sending a proposal to delegate SKL tokens to the validator from the delegator's Escrow account.
   */
  ({ data, amount, address } = Escrow.methods().delegate.call({
    validatorId: idOfValidator,
    amount: amounttoDelegate,
    delegationPeriod: proposedDelegationPeriod,
    info: descriptionAboutDelegation,
  }));
  const transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);


}

sendBitGoTx();
