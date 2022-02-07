# CrossCash (🐧,🐓)

To jump to developpement, scroll to the buttom of this page.

A web3 crypto wallet with build-in bridge support, built as a [browser extension](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Anatomy_of_a_WebExtension).

At crosscash, we are building an ethereum wallet that can enable bridging of assets seamlessly, as opposed to manually moving funds from one network to the other. That allows users to interact with any contract on any network, no matter where their funds are. 

## We want to end: 

- The switching between different RPC endpoints manually
- The bridging of asset between different networks manually

## Roadmap: 

Our focus is the user experience on interoperability. Our first phase is building a wallet with existing technologies with security as our top priority. Our next phase is to integrate a bridge that will server as the first back-end.

Main global tasks to launch the first version of the app:

- ### Extension to DAAP connection
    - Build an architecture to expose window.ethereum into the extension so to receive and send [JSON RPC](https://ethereum.org/en/developers/docs/apis/json-rpc/) methods from other clients. DAAPs sends request using ethereum.window object on the browser —> Extension receive requests, verify it and sends back response to daaps

- ### Support for a second ethereum layer 2 network
    - Layer 2 advantages are lower fees and faster transactions. Our wallet will need to support different ethereum networks. That means all functions needs to be working properly at least a second Layer network. That includes transacting with daaps, sending tokens, view assets, etc..
- ### Integrate a bridge to use in transactions
    -This is where our wallet stands out, by having a bridge in the backend to move funds between different Layer 2 networks and Ethereum mainnet

## Developpement

Quick Start:

    npm install -g yarn # if you don't have yarn globally installed
    yarn install
    yarn start

Once the app is running, you can install the extension in your browser of choice:
- [Firefox instructions](https://extensionworkshop.com/documentation/develop/temporary-installation-in-firefox/)
- [Chrome, Brave, and Opera instructions](https://developer.chrome.com/docs/extensions/mv3/getstarted/#manifest)
    - Note that these instructions are for Chrome, but substituting brave://extensions or opera://extensions for chrome://extensions depending on browser should get you to the same buttons.
    - Also note that the extension will only work if you load the dev folder instead of the directory of the wallet extension.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

# Code Structure
### All code currently lives under src. Inside src:
- popup
    - Most of the UI code lives here
- options
    - An option page currently for future settings of the wallet
- lib
    - Includes API services, helper functions and global constants
- assets
    - images and logos
- background, contentscript, inpage
    - everything related to extention scripts. TBD

## Wallet currently suppports as of 30/01/2021:
- Importing / creating a wallet
- Dummy password to unlock reading of wallet
- Real password verification to decrypt the wallet to sign transactions
- Asset list page
- Transaction list page & single transaction details
- Sending ETH and ERC-20s