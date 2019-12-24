import { Contract } from '../../src/contract';

const makerProxyRegistry = new Contract('DSProxyFactory'); // there is only 1, so no need for instance
const daiToken = new Contract('StandardERC20').instance('dai');

const ownerAddress = '0xcf429eeaf118f4ab75ff0f2e37036243295ed2fd';

// First we need to deploy a proxy contract that will simplify adding our DAI to the DSR
let { data, amount, address } = makerProxyRegistry.methods().build({ owner: ownerAddress });

console.log(`To enter create a Maker Proxy, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);


// ============================================ //
// ============================================ //


// Now we need to go get the address of the newly created proxy contract. The easiest way to do this is go to
// Etherscan, viewing the transaction that was created above, click "Internal Transactions", and clicking the "to'
// address from the first listed transaction

const proxyAddress = '0xe5b62f8768e7c5ce5c43cd852d663fce5ad7ba14';
const daiSavingsRateProxy = new Contract('DSProxy').address(proxyAddress);


// ============================================ //
// ============================================ //


// Now we need to approve ownership of some of our DAI to our proxy

const depositAmount = 1e18; // 1 DAI

({ data, amount, address } = daiToken.methods()
  .approve({
    _spender: proxyAddress,
    _value: depositAmount.toString(10),
  }));

console.log(`\nTo approve ${depositAmount} DAI to maker proxy contract, send:`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);


// ============================================ //
// ============================================ //


// Now we can actually deposit it and get the DSR
// This is a weird one, since we must build an internal transaction that the proxy we built in step 1 will call
// In other words, we are telling our proxy to deposit DAI into the DSR on our behalf

// The following two addresses are constants in the MakerDAO MCD ecosystem. You can look them up and verify on Etherscan
const daiJoin = '0x9759a6ac90977b93b58547b4a71c78317f391a28';
const mcdPot = '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7';

// Build the internal "deposit into DSR" data
const dsProxyActionsDsrContract = new Contract('DSProxyActionsDsr');
const { data: internalData, address: proxyActionsAddress } = dsProxyActionsDsrContract.methods()
  .join({ daiJoin, pot: mcdPot, wad: depositAmount.toString(10) });

// Build the external call for our proxy to deposit to the DSR

({ data, amount, address } = daiSavingsRateProxy.methods()
  .execute({
    _target: proxyActionsAddress,
    _data: internalData,
  }));

console.log(`\nTo deposit ${depositAmount} DAI into the DSR`);
console.log(`Data: ${data}`);
console.log(`Amount: ${amount} ETH`);
console.log(`To: ${address}`);
