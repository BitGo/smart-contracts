import { BitGo } from 'bitgo';
import { getContractsFactory } from '../../../src/index';


async function sendBitGoTx(): Promise<void> {

  const bitGo = new BitGo({ env: 'prod' });
  const baseCoin = bitGo.coin('eth');
  bitGo.authenticateWithAccessToken({ accessToken: 'access token' });
  const bitGoWallet = await baseCoin.wallets().get({ id: 'wallet id' });
  const walletPassphrase = 'password';

  const proxyAddress = '0xB575c158399227b6ef4Dcfb05AA3bCa30E12a7ba';
  const Allocator = getContractsFactory('eth').getContract('SkaleAllocator').address(proxyAddress);

  /**
   * Get the Escrow wallet address that is linked to the delegator's Bitgo wallet address
   */
  let { data, amount, address } = Allocator.methods().getEscrowAddress.call({
    beneficiary: bitGoWallet.getAddress(),
  });
  const escrowAddress = await bitGoWallet.send({ data, amount, address, walletPassphrase });

  const delegationControllerAddress = '0x06dD71dAb27C1A3e0B172d53735f00Bf1a66Eb79';
  const DelegationController = getContractsFactory('eth').getContract('SkaleDelegationController').address(delegationControllerAddress);
  const delegations = [];
  /**
   * List all of the delegations for th token holder's Escrow contract.
   * This will return the states of each of the delegation requests sent.
   *
   * First get Total amount of delegations for the holder
   */
  const delegationsTotal = ({ data, amount, address } = DelegationController.methods().getDelegationsByHolderLength.call({
    holder: escrowAddress,
  }));

  /**
   * Then get the delegation ids for the total amount of delegations.
   */
  for (let index = 0; index < parseInt(delegationsTotal.data, 10); index++) {
    const delegation = { info: {}, state: {} };

    const delegationId = ({ data, amount, address } = DelegationController.methods().delegationsByHolder.call({
      address: escrowAddress,
      index: index,
    }));

    const delegationInfo = ({ data, amount, address } = DelegationController.methods().getDelegation.call({
      delegationId: delegationId,
    }));

    /**
     * Get the state of the delegation (PROPOSED, ACCEPTED, CANCELED, etc). State is returned as an integer
     * where 0 = PROPOSED, 1 = ACCEPTED, etc
     * States can be found below
     *  //https://github.com/skalenetwork/skale-manager/blob/develop/contracts/delegation/DelegationController.sol#L64
     */
    const delegationState = ({ data, amount, address } = DelegationController.methods().getState.call({
      delegationId: delegationId,
    }));

    delegation.info = delegationInfo.data;
    delegation.state = delegationState.data;

    delegations.push(delegation);
  }
  const transaction = await bitGoWallet.send({ data, amount, address, walletPassphrase });
  console.dir(transaction);

}

sendBitGoTx();
