import { BitGo } from 'bitgo';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });

  const proxyAddress = '0xB575c158399227b6ef4Dcfb05AA3bCa30E12a7ba';
  const Allocator = new Contract('SkaleAllocator').address(proxyAddress);

  /**
     * Get the Escrow wallet address that is linked to the investor's Bitgo wallet address
     */
  const { data, amount, address } = Allocator.methods().getEscrowAddress.call({
    beneficiary: bitGoWallet.getAddress(),
  });

  console.log(data, amount, address);

}

sendBitGoTx();
