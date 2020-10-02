import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    const proxyAddress = '0x840C8122433A5AA7ad60C1Bcdc36AB9DcCF761a5';
    const ValidatorService = new Contract('SkaleValidatorService').address(proxyAddress);

    /**
     * List all of the trusted validators that are registered within the SKALE Network.
     */
    let { data, amount, address } = ValidatorService.methods().getTrustedValidators.call({});
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);

}

sendBitGoTx();
