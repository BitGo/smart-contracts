# Smart Contract SDK

A simple library for building smart contract interactions. When offline, or away from a web3 wallet, smart 
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
import { getContractsFactory } from '@bitgo/eth-contracts';
const cDAI = getContractsFactory('eth').getContract('Compound').instance('cDAI');
const { data, amount, address } = cDAI.methods().mint.call({ mintAmount: '1000000000' });
```

Users can specify an instance of the contract protocol by address instead of name
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const cDAI = getContractsFactory('eth').getContract('Compound').address('0x5d3a536e4d6dbd6114cc1ead35777bab948e3643');
const { data, amount, address } = cDAI.methods().mint.call({ mintAmount: '1000000000' });
```

The decoder can parse call data and output a human-readable explanation of a given contract call.
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const decoder = getContractsFactory('eth').getDecoder();
decoder.decode(Buffer.from('a9059cbb00000000000000000000000010d4f942617a231eb1430c88fe43c8c2050437d90000000000000000000000000000000000000000000000000000000000002710', 'hex'));
{ methodId: '0xa9059cbb',
  name: 'transfer',
  args:
   [ { name: '_to',
       type: 'address',
       value: '0x10d4f942617a231eb1430c88fe43c8c2050437d9' },
     { name: '_value', type: 'uint256', value: 10000 } ],
  contractName: 'StandardERC20' }
```


## Integration with BitGo SDK

The output of this library is well formed as an argument to a BitGo SDK `sendMany` call. This makes it useful for 
integration alongside the Bitgo SDK.

### Example Usage with BitGo

```js
import { getContractsFactory } from '@bitgo/eth-contracts';

import { BitGo, Coin } from 'bitgo';

async function sendBitGoTx() {
    const bitGo = new BitGo({ env: 'test' });
    const baseCoin = bitGo.coin('eth');
    const bitGoWallet = await baseCoin.wallets().get({ id: '5941ce2db42fcbc70717e5a898fd1595' });

    const cDAI = getContractsFactory('eth').getContract('Compound').instance('cDAI');
    
    const transaction = await bitGoWallet.sendMany({
      recipients: cDAI.methods().mint.call({ mintAmount: '1000000000' }),
      walletPassphrase: 'password'
    })
      
}

sendBitGoTx();
```

## Types

#### Contract
**listContractTypes()** -- get the available contract types.
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').listContractTypes();
// response: ['Compound', 'StandardERC20']
```

**listMethods()** -- get the available contract methods.
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').listMethods();
// response: [{ name: 'transfer', inputs: [...], outputs: [...] }, { name: 'approve', ... }]
```

**methods()** -- get contract method builder objects
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').methods();
// response: { transfer: { call: <function to build transfer> }, approve: { call: <function to build approve> } }
```

**getName()** -- get contract name
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').getName();
// response: StandardERC20
```

**address()** -- set contract address
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').address('0x5d3a536e4d6dbd6114cc1ead35777bab948e3643');
// response: Contract with address set
```

**instance()** -- set contract instance
```js
import { getContractsFactory } from '@bitgo/eth-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').instance('DAI');
// response: Contract with DAI address set
```

## Supported Protocols:

This library supports a limited number of smart contract protocols, as it maintains solidity ABIs locally. 
- Compound -- [Examples](./eth/examples/Compound)
- StandardERC20 -- [Examples](./eth/examples/StandardERC20)
- MakerDAO -- [Examples](./eth/examples/MakerDAO)

## Adding a new ABI type
This library is quite extensible to new protocols -- if there are other contract types that you would like to use, 
feel free to submit a PR adding them. To do so, make the following changes:
- Add the JSON ABI to `abis` directory, named `[ProtocolName].json`
- Add the ProtocolName and addresses for various instances of the protocol in `config/instances.json`
    - For example, Compound protocol has cDAI, cUSDC, etc.
- Add the protocol to the README above
- Add some example usages in the `examples` directory
