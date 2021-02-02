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

  const tokenStateAddress = '0x1F2157Bf5C820f68826ef1DC71824816Ee795f41';
  const TokenState = getContractsFactory('eth').getContract('SkaleTokenState').instance();
  TokenState.address = tokenStateAddress;

  /**
   * List the amount of the tokens that are locked within the token holder's Escrow
   * contract.
   */
  ({ data, amount } = TokenState.methods().getAndUpdateLockedAmount.call({
    holder: escrowAddress,
  }));
  const transaction = await bitGoWallet.send({ data, amount, address: TokenState.address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
