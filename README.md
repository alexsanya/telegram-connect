# Web3 Wallet bridge

Bridge between telegram bot and web3 wallet. Allows to isolate private key storage from Dapp running as telegram bot


# Idea
User interacts with Dapp via telegram chat and gives the instruction about operation he wants to perform in a human-friendly way. Dapp builds the transaction and offers user to sign it with his private key. To achieve this telegram bot sends web link to chat, this link leads to static web page with query parameters. Web page upon rendering let's user to sign transaction / message via his web3 wallet. The result of action sent back to Dapp server via web hook.

## Query parameters
- botName - the name of telegram bot - used in deep link  "Back to chat"
- type - transaction / signature
- uid - telegram chat id - used by backend to identify the source of event
- source - url to json object that describes the type of operation
- callback - backend endpoint for web-hooks, CORS needs to be enabled for this endpoint
### Example
`http://wallet-bridge.s3-website-us-east-1.amazonaws.com?botName=w3BridgeBot&type=transaction&uid=752941613&source=http%3A%2F%2Fec2-18-209-66-210.compute-1.amazonaws.com%2Ftransaction%3Fvalue%3D123&callback=http%3A%2F%2Fec2-18-209-66-210.compute-1.amazonaws.com%2Fevent`

## Specs
#### Transaction:
```json
{
  "chainId": 324,
  "address": "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
  "abi": [
    "function approve(address spender, uint256 value)"
  ],
  "functionName": "approve",
  "args": [
    "0x4a89caAE3daf3Ec08823479dD2389cE34f0E6c96",
    "456"
  ]
}
```

#### Signature
```json
{
  "domain": {
    "name": "Tether USD",
    "version": "1",
    "chainId": 324,
    "verifyingContract": "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C"
  },
  "primaryType": "Permit",
  "types": {
    "Permit": [
      {
        "name": "owner",
        "type": "address"
      },
      {
        "name": "spender",
        "type": "address"
      },
      {
        "name": "value",
        "type": "uint256"
      },
      {
        "name": "nonce",
        "type": "uint256"
      },
      {
        "name": "deadline",
        "type": "uint256"
      }
    ]
  },
  "message": {
    "owner": "0xD0eA653E473d7a544268e0DCc7CE0a4F45133f4A",
    "spender": "0x493257fD37EDB34451f62EDf8D2a0C418852bA4C",
    "value": "12345",
    "nonce": 5,
    "deadline": "1916240884"
  }
}
```
### Demo
Transaction: https://youtube.com/shorts/PhpaYLvqH00?feature=share
Signature: https://youtube.com/shorts/6EL9BmoD79I?feature=share

### Screens
#### Transaction
![enter image description here](https://static-img-hosting.s3.amazonaws.com/SendScreen.png)

#### Signature
![enter image description here](https://static-img-hosting.s3.amazonaws.com/SignatureScreen.png)
