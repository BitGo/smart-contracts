import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    const proxyAddress = '0xB575c158399227b6ef4Dcfb05AA3bCa30E12a7ba';
    const Allocator = new Contract('Allocator').address(proxyAddress);

    /**
     * Get the Escrow wallet address that is linked to the delegator's Bitgo wallet address
     */
    let { data, amount, address } = Allocator.methods().getEscrowAddress.call({
        beneficiary: bitGoWallet.getAddress()
    });
    let escrowAddress = await bitGoWallet.send({ data, amount, address, walletPassphrase });

    const tokenStateAddress = '0x1F2157Bf5C820f68826ef1DC71824816Ee795f41';
    const TokenState = new Contract('TokenState').address(tokenStateAddress);
    
    /**
     * List the amount of the tokens that are locked within the token holder's Escrow
     * contract.
     */
    ({ data, amount, address } = TokenState.methods().getAndUpdateLockedAmount.call({
        holder: escrowAddress
    }));
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

}

sendBitGoTx();
