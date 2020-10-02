import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    const proxyAddress = '0x2a42Ccca55FdE8a9CA2D7f3C66fcddE99B4baB90';
    const Distributor = new Contract('SkaleDistributor').address(proxyAddress);

    //parameter needed for checking the earned bounties
    const idOfValidator = "validator id";

    /**
     * Retrieve the amount of earned bounties for the provided by token holder (delgator).
     * This will return the bounties earned since the last withdraw for a specific delegation to a validator.
     * This needs to be called for each validator that a token holder (delegator) is delegating to.
     */
    let { data, amount, address } = Distributor.methods().getAndUpdateEarnedBountyAmount.call({
        validatorId: idOfValidator
    });
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

}

sendBitGoTx();
