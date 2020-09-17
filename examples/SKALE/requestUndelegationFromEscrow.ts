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
    const Allocator = new Contract('SkaleAllocator').address(proxyAddress);

    /**
     * Get the Escrow wallet address that is linked to the delegator's Bitgo wallet address
     */
    let { data, amount, address } = Allocator.methods().getEscrowAddress.call({
        beneficiary: bitGoWallet.getAddress()
    });
    let escrowAddress = await bitGoWallet.send({ data, amount, address, walletPassphrase });

    //Retrieve Escrow contract for delegator
    const Escrow = new Contract('SkaleEscrow').address(escrowAddress);

    //parameter for the id of the undelegation request
    const idOfDelegation = 'ID of delegation to undelegate';

    
    /**
     * Request to undelegate from the delegator's Escrow account.
     *
     * After the epoch starts all delegations that are accepted turns to DELEGATED state.
     * Token holders (delegators) can request undelegation once the delegation is in the DELEGATED state
     * But only their delegations will be “undelegated” once their delegation period is over.
     */
    ({ data, amount, address } = Escrow.methods().requestUndelegation.call({
        delegationId: idOfDelegation
    }));
    let transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
    console.dir(transaction);


}

sendBitGoTx();
