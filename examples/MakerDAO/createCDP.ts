import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';

const makerProxyRegistry = new Contract('DSProxyFactory'); // there is only 1, so no need for instance

async function sendBitGoTx(): Promise<void> {
  // step 1 - setup your bitgo wallet and deploy your proxy

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  const withdrawAmount = 30 * 1e18; // The amount of dai you want to withdraw (more than $30).
  const depositAmount = 1e18; // Amount of eth you want to deposit
  bitGo.authenticateWithAccessToken({ accessToken: 'access token here' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id here' });
  const walletPassphrase = 'password';


  // First we need to deploy a proxy contract that will simplify adding our DAI to the DSR
  // Note this step only needs to be done once per wallet, so if you have already done it, skip to the next step

  let { data, amount, address } = makerProxyRegistry.methods().build.call({});
  let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);

  // ============================================ //
  // ============================================ //

  // step 2 - Create CDP and withdraw DAI

  // Now we need to go get the address of the newly created proxy contract. The easiest way to do this is go to
  // the Etherscan page for the Proxy Registry contract, here: https://etherscan.io/address/0x4678f0a6958e4d2bc4f1baf7bc52e8f3564f3fe4#readContract
  // Enter your wallet address in the `proxies` query, then press `Query`. It will return your proxy address

  const proxyAddress = '0x17458bbdd96d6c19645457f5fae87ed5a07ad8fd';

  const daiSavingsRateProxy = new Contract('DSProxy').address(proxyAddress);

  // The following addresses are constants in the MakerDAO MCD ecosystem. You can look them up and verify on Etherscan
  const daiJoin = '0x9759a6ac90977b93b58547b4a71c78317f391a28';
  const ethJoin = '0x2f0b23f53734252bda2277357e97e1517d6b042a';
  const manager = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';
  const jug = '0x19c0976f590d67707e62397c87829d896dc0f1f1';

  const ilk = new Buffer('4554482d41000000000000000000000000000000000000000000000000000000', 'hex');
  const dsProxyActionsContract = new Contract('DSProxyActions');

  const { data: internalData, address: proxyActionsAddress } = dsProxyActionsContract.methods()
        .openLockETHAndDraw.call({ manager, jug, ethJoin, daiJoin, ilk, wadD: withdrawAmount.toString(10) });
    // Build the external call for our proxy to create the cdp

  ({ data, amount, address } = daiSavingsRateProxy.methods()
        .execute.call({
          _target: proxyActionsAddress,
          _data: ethUtil.toBuffer(internalData),
        }));

  // send the transaction through BitGo
  transaction = await bitGoWallet.send({
    data,
    address,
    amount: depositAmount.toString(10),
    walletPassphrase,
  });

  console.dir(transaction);
}


sendBitGoTx();
