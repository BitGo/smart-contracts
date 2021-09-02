# Smart Contract SDK

A simple library for building smart contract interactions. When offline, or away from a web3 wallet, smart 
contract interaction is quite difficult. This is because it requires special transaction data that defines 
a function call on a smart contract. This library intends to improve this experience by providing a simple interface
for common smart contract function calls. It also aims to be extensible to a wide variety of contracts.

## Installing

```bash
npm i @bitgo/smart-contracts
```

## Supported Chains

* eth
* trx


## Example Usage

***
The basic usage enables users to specify contracts by name and build transaction data from them.
<br />

##### Ethereum example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const cDAI = getContractsFactory('eth').getContract('Compound').instance('cDAI');
const { data, amount, address } = cDAI.methods().mint.call({ mintAmount: '1000000000' });
```

<br />

##### Tron example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const cWbtcEth = getContractsFactory('trx').getContract('WrappedToken').instance('WBTC');
const { data, amount } = cWbtcEth.methods().transfer.call({ _to: 'TGeT2sfMYcjx3ra2HhQUvMyBcVhjBc1Lbk', _value: '100' });
```
***
<br />

Users can specify an instance of the contract protocol by address instead of name
##### Ethereum example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const cDAI = getContractsFactory('eth').getContract('Compound').instance()
cDai.address = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643';
const { data } = cDAI.methods().mint.call({ mintAmount: '1000000000' });
```
<br />

##### Tron example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const cDAI = getContractsFactory('trx').getContract('WrappedToken').instance()
cWbtcEth.address = 'TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65';
const { data } = cWbtcEth.methods().transfer.call({ _to: 'TGeT2sfMYcjx3ra2HhQUvMyBcVhjBc1Lbk', _value: '100' };
```

***
The decoder can parse call data and output a human-readable explanation of a given contract call.
<br />

##### Ethereum example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
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
<br />

##### Tron example
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const decoder = getContractsFactory('trx').getDecoder();
decoder.decode(Buffer.from('a9059cbb000000000000000000000000efc230e125c24de35f6290afcafa28d50b43653600000000000000000000000000000000000000000000000000000000000003e8', 'hex'));
// result
{ methodId: '0xa9059cbb',
  name: 'transfer',
  args:
   [ { name: '_to',
       type: 'address',
       value: 'TXpw8XeWYeTUd4quDskoUqeQPowRh4jY65' },
     { name: '_value', type: 'uint256', value: '1000' } ],
  contractName: 'StandardERC20' }
```


## Integration with BitGo SDK

The output of this library is well formed as an argument to a BitGo SDK `sendMany` call. This makes it useful for 
integration alongside the Bitgo SDK.

### Example Usage with BitGo

```js
import { getContractsFactory } from '@bitgo/smart-contracts';

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
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').listContractTypes();
// response: ['Compound', 'StandardERC20']
```

**listMethods()** -- get the available contract methods.
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').listMethods();
// response: [{ name: 'transfer', inputs: [...], outputs: [...] }, { name: 'approve', ... }]
```

**methods()** -- get contract method builder objects
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').methods();
// response: { transfer: { call: <function to build transfer> }, approve: { call: <function to build approve> } }
```

**.name** -- get contract name property
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').name;
// response: StandardERC20
```

**.address** -- set contract address property to the contract instance
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').instance();
type.address = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643';
// response: Contract intance with address set
```

**instance()** -- set contract instance
```js
import { getContractsFactory } from '@bitgo/smart-contracts';
const types = getContractsFactory('eth').getContract('StandardERC20').instance('DAI');
// response: Contract with DAI address set
```

## Supported Protocols:

This library supports a limited number of smart contract protocols, as it maintains solidity ABIs locally. 

* On ethereum chain
  - Compound -- [Examples](./eth/examples/Compound)
  - StandardERC20 -- [Examples](./eth/examples/StandardERC20)
  - MakerDAO -- [Examples](./eth/examples/MakerDAO)
  - Aave -- [Examples](./eth/examples/Aave)
* On tron chain
  - WrappedToken - [Examples](./trx/examples/WrappedToken)

## Adding a new ABI type
This library is quite extensible to new chains and protocols -- if there are other contract types that you would like to use, 
feel free to submit a PR adding them. To do so, make the following changes:
- Add a new supported chain creating the directory `chainName` at the root level of the project, for example eth, trx, etc. 
- Add the JSON ABI to `chainName/abis` directory, named `[ProtocolName].json`.
- Add the ProtocolName and addresses for various instances of the protocol in `chainName/config/instances.json`
    - For example, Compound protocol has cDAI, cUSDC, etc for eth chain.
- Add the protocol to the README above
- Add some example usages in the `chainName/examples` directory
