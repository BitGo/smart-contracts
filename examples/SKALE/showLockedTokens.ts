import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    const delegatorWalletAddress = 'delegator wallet address';
    const proxyAddress = '0x1F2157Bf5C820f68826ef1DC71824816Ee795f41';
    const TokenState = new Contract('TokenState').address(proxyAddress);
    
    /**
     * List the amount of the tokens that are locked within the token holder (delegator)
     * wallet.
     */
    let { data, amount, address } = TokenState.methods().getAndUpdateLockedAmount.call({holder: delegatorWalletAddress});
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

}

sendBitGoTx();
