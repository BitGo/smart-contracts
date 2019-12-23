# Ethereum Contract SDK

A simple library for building Ethereum smart contract interactions. When offline, or away from a web3 wallet, smart 
contract interaction is quite difficult. This is because it requires special transaction data that defines 
a function call on a smart contract. This library intends to improve this experience by providing a simple interface
for common smart contract function calls. It also aims to be extensible to a wide variety of contracts.

## Installing

```bash
npm i @bitgo/eth-contracts
```

## Example Usage


The basic usage enables users to specify contracts by name and build transaction data from them.
```js
import { Contract } from '@bitgo/eth-contracts';
const cDAI = new Contract('Compound').instance('cDAI');
const { data, amount, address } = cDAI.methods().mint({ mintAmount: '1000000000' });
```

Users can specify an instance of the contract protocol by address instead of name
```js
import { Contract } from '@bitgo/eth-contracts';
const cDAI = new Contract('Compound').address('0x5d3a536e4d6dbd6114cc1ead35777bab948e3643');
const { data, amount, address } = cDAI.methods().mint({ mintAmount: '1000000000' });
```


## Integration with BitGo SDK

The output of this library is well formed as an argument to a BitGo SDK `sendMany` call. This makes it useful for 
integration alongside the Bitgo SDK.

### Example Usage with BitGo

```js
import { Contract } from '@bitgo/eth-contracts';

import { BitGo, Coin } from 'bitgo';

async function sendBitGoTx() {
    const bitGo = new BitGo({ env: 'test' });
    const baseCoin = bitGo.coin('eth');
    const bitGoWallet = await baseCoin.wallets().get({ id: '5941ce2db42fcbc70717e5a898fd1595' });

    const cDAI = new Contract('Compound').instance('cDAI');
    
    const transaction = await bitGoWallet.sendMany({
      recipients: cDAI.methods().mint({ mintAmount: '1000000000' }),
      walletPassphrase: 'password'
    })
      
}

sendBitGoTx();
```

## Types

#### Contract
**listContractTypes()** -- get the available contract types.
```js
const types = Contract.listContractTypes();
// response: ['Compound', 'StandardERC20']
```

**listMethods()** -- get the available contract methods.
```js
const types = new Contract('StandardERC20').listMethods();
// response: [{ name: 'transfer', inputs: [...], outputs: [...] }, { name: 'approve', ... }]
```

**methods()** -- get contract method builder objects
```js
const types = new Contract('StandardERC20').methods();
// response: { transfer: <function to build transfer>, approve: <function to build approve> }
```

**getName()** -- get contract name
```js
const types = new Contract('StandardERC20').getName();
// response: StandardERC20
```

**address()** -- set contract address
```js
const types = new Contract('StandardERC20').address('0x5d3a536e4d6dbd6114cc1ead35777bab948e3643');
// response: Contract with address set
```

**instance()** -- set contract instance
```js
const types = new Contract('StandardERC20').instance('WBTC');
// response: Contract with WBTC address set
```

## Supported Protocols:

This library supports a limited number of smart contract protocols, as it maintains solidity ABIs locally. 
- Compound -- [Examples](./examples/Compound)
- StandardERC20 -- [Examples](./examples/StandardERC20)

## Adding a new ABI type
This library is quite extensible to new protocols -- if there are other contract types that you would like to use, 
feel free to submit a PR adding them. To do so, make the following changes:
- Add the JSON ABI to `abis` directory, named `[ProtocolName].json`
- Add the ProtocolName and addresses for various instances of the protocol in `config/instances.json`
    - For example, Compound protocol has cDAI, cUSDC, etc.
- Add the protocol to the README above
