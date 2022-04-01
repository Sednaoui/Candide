import { FungibleAsset } from '../assets';

// A base address is the zero address for the main asset of the network.
// For Ethereum, it's ETH / For Polygon, it's MATIC.
export const baseAddress = '0x0000000000000000000000000000000000000000';

export const ETH: FungibleAsset = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    address: baseAddress,
    metadata: {
        coinGeckoID: 'ethereum',
        logoURL: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png?1595348880',
        tokenLists: [],
        websiteURL: 'https://ethereum.org',
    },
};

export const MATIC: FungibleAsset = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    address: baseAddress,
    metadata: {
        coinGeckoID: 'matic-network',
        logoURL: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png?1624446912',
        tokenLists: [],
        websiteURL: 'https://matic.network',
    },
};
