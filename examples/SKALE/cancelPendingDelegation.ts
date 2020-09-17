import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    //parameter needed for cancel delegation request
    const idOfDelegation = 'ID of delegation to cancel';

    const proxyAddress = '0x06dD71dAb27C1A3e0B172d53735f00Bf1a66Eb79';
    const DelegationController = new Contract('SkaleDelegationController').address(proxyAddress);

    /**
     * This allows the delegator to cancel the PENDING delegation before the validator approves 
     * or before the start of the next Epoch.
     * If a delegation is already in the DELEGATED or COMPLETED state, this method can not be called.
     */
    let { data, amount, address } = DelegationController.methods().cancelPendingDelegation.call({
        delegationId: idOfDelegation
    });
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

}

sendBitGoTx();
