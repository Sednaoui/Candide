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
        logoURL: 'https://i0.wp.com/www.pnglib.com/wp-content/uploads/2020/08/ethereum-purple-blue-icon_5f457c867236d.png?fit=680%2C680&ssl=1',
        tokenLists: [],
        websiteURL: 'https://ethereum.org',
    },
};
