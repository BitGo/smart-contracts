import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';

const daiToken = new Contract('StandardERC20').instance('dai');

async function sendBitGoTx(): Promise<void> {
    // This assume you already have a CDP at Maker from our example createCDP
    // It also assume you already have a CDP setup
    // step 1 - Approve the number of tokens you would like the proxy to access

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    const depositAmount = 5e18; // The amount of dai you want to deposit.
    const withdrawAmount = 1e17; // The amount of eth you want to withdraw.
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    // your proxy
    const proxyAddress = '0x17458bbdd96d6c19645457f5fae87ed5a07ad8fd';
    const daiSavingsRateProxy = new Contract('DSProxy').address(proxyAddress);

    let { data, amount, address } = daiToken.methods().approve.call(
        {
            _spender: proxyAddress,
            _value: depositAmount.toString(10),
        });
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

    // Note this step only needs to be done once based on the amount you approve

    // ============================================ //
    // ============================================ //

    // step 2 - Deposit Dai and withdraw ETH

    // Now we need to go get the cdp id of the cdp that you created. The easiest way to do this is go to
    // the Etherscan page for the Dai manager contract, here: https://etherscan.io/address/0x5ef30b9986345249bc32d8928b7ee64de9435e39#readContract
    // Enter your proxy address in the 'last' query, then press `Query`. It will return your cdpid
    const cdp = '1913';

    // The following two addresses are constants in the MakerDAO MCD ecosystem. You can look them up and verify on Etherscan
    const daiJoin = '0x9759a6ac90977b93b58547b4a71c78317f391a28';
    const ethJoin = '0x2f0b23f53734252bda2277357e97e1517d6b042a';
    const manager = '0x5ef30b9986345249bc32d8928b7ee64de9435e39';

    const dsProxyActionsContract = new Contract('DSProxyActions');

    const { data: internalData, address: proxyActionsAddress } = dsProxyActionsContract.methods()
        .wipeAndFreeETH.call({ manager, ethJoin, daiJoin, cdp, wadC: withdrawAmount.toString(10), wadD: depositAmount.toString(10) });

    // Build the external call for our proxy to deposit dai and withdaw eth
    ({ data, amount, address } = daiSavingsRateProxy.methods()
        .execute.call({
            _target: proxyActionsAddress,
            _data: ethUtil.toBuffer(internalData),
        }));
    // send the transaction through BitGo

    transaction = await bitGoWallet.send({
        data,
        address,
        amount,
        walletPassphrase,
    });

    console.dir(transaction);
}

sendBitGoTx();
