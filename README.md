## In a nutshell: 

### What I am building
A ethereum wallet built as a web extension. (inspiration: metamask (http://metamask.io/), tally-cash (https://tally.cash/), frame (https://github.com/floating/frame-extension))

First step is to build a MVP. The bare minimum to demonstrate a wallet with its special features. 

### What needs to be done for MVP
1. Extension to DAAP (decentrilized apps) connection
2. Add support for a different network other than ethereum main network. 
3. Add special feature of bridge support. 

### In details
1. Extension to DAAP (decentrilized apps) connection
Build an architecture to expose window.ethereum into my extension so I can receive and send information from other websites. 
DAAPs sends request using ethereum.window object on the browser —> Extension receive requests, verify it and sends back response to daaps. 

### Helpful resources
Anatomy of extensions: https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension
JSON-RPC API: https://ethereum.org/en/developers/docs/apis/json-rpc/
Universal Ethereum provider: https://github.com/floating/eth-provider

### To-do
2. Add support for a different network other than ethereum main network. 
Ethereum has different networks. Mainnet is the principal network, and then comes "Layer 2". Layer 2 advantages are lower fees and faster transactions. Our wallet will need to support different ethereum networks. That means all functions needs to be working properly on Layer 2s. That includes transacting with daaps, sending tokens, view assets, etc..

3. Add special feature of bridge support.
This is where our wallet stands out, by having a bridge in the backend to move funds between different Layer 2 networks and Ethereum mainnet.
