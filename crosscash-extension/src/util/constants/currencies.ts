import { FungibleAsset } from '../assets';

export const ETH: FungibleAsset = {
    name: 'Ether',
    symbol: 'ETH',
    decimals: 18,
    metadata: {
        coinGeckoID: 'ethereum',
        tokenLists: [],
        websiteURL: 'https://ethereum.org',
    },
};
