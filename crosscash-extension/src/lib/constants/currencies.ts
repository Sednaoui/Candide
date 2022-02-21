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

export const MATIC: FungibleAsset = {
    name: 'Matic',
    symbol: 'MATIC',
    decimals: 18,
    address: baseAddress,
    metadata: {
        coinGeckoID: 'matic-network',
        logoURL: 'https://polygontechnology.notion.site/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F938afd3e-e620-4946-9206-41d9f00e581e%2FPrimary_Token.svg?table=block&id=620f7178-47ea-4f35-b85f-ccbdb5bf47c3&spaceId=51562dc1-1dc5-4484-bf96-2aeac848ae2f&userId=&cache=v2',
        tokenLists: [],
        websiteURL: 'https://matic.network',
    },
};
