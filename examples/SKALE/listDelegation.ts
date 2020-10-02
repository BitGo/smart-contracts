import { BitGo } from 'bitgo';
import * as ethUtil from 'ethereumjs-util';
import { Contract } from '../../src/contract';


async function sendBitGoTx(): Promise<void> {

    const bitGo = new BitGo({ env: 'prod' });
    const baseCoin = bitGo.coin('eth');
    bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
    const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
    const walletPassphrase = 'password';

    const proxyAddress = '0x06dD71dAb27C1A3e0B172d53735f00Bf1a66Eb79';
    const DelegationController = new Contract('SkaleDelegationController').address(proxyAddress);

    let delegations = [];
    /**
     * List all of the delegations for th token holder (delegator).
     * This will return the states of each of the delegation requests sent.
     * 
     * First get Total amount of delegations for the holder
     */
    let { data, amount, address } = DelegationController.methods().getDelegationsByHolderLength.call({
        holder: bitGoWallet.getAddress()
    });

    /**
     * Then get the delegation ids for the total amount of delegations.
     */
    for (let index = 0; index < parseInt(data); index++) {
        let delegation = {info: {}, state: {}};

        let delegationId = ({ data, amount, address } = DelegationController.methods().delegationsByHolder.call({
            address: bitGoWallet.getAddress(),
            index: index
        }));

        let delegationInfo = ({ data, amount, address } = DelegationController.methods().getDelegation.call({
            delegationId: delegationId
        }));

        /** Get the state of the delegation (PROPOSED, ACCEPTED, CANCELED, etc). State is returned as an integer
        * where 0 = PROPOSED, 1 = ACCEPTED, etc 
        * States can be found below
        //https://github.com/skalenetwork/skale-manager/blob/develop/contracts/delegation/DelegationController.sol#L64
        */
        let delegationState = ({ data, amount, address } = DelegationController.methods().getState.call({
            delegationId: delegationId
        }));

        delegation.info = delegationInfo.data;
        delegation.state = delegationState.data;

        delegations.push(delegation);
    }

}

sendBitGoTx();
