# bitpic

[bitpic protocol](https://bitpic.network) validation library.

# Install

```
npm install --save bitpic
```

# Usage


## 1. Basic

You can pass in a raw transaction hex string to verify

```
bitpic.verify(<Raw Transaction Hex>).then((res) => {
  // res := true|false
})
```

## 2. BOB serialization format

You can also pass in a BOB serialization format:

```
bitpic
.verify(<BOB Transaction Formatted JSON>, { format: "bob" })
.then((res) => {
  // res := true|false
})
```

## 3. Return the matched cell

If you pass in an additional `{ cell: true }` option, it returns the matched cell within the parsed transaction:

```
bitpic
.verify(<BOB Transaction Formatted JSON>, { cell: true })
.then((res) => {
  // res := <matched cell>|false
})
```

# Examples

Find out some examples under the [demo](demo) folder.
