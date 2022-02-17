import { EVMNetwork } from '../networks';
import { ETH } from './currencies';

export const ARBITRUM: EVMNetwork = {
    name: 'Arbitrum',
    baseAsset: ETH,
    chainID: 42161,
    family: 'EVM',
};

export const MAINNET: EVMNetwork = {
    name: 'Ethereum',
    baseAsset: ETH,
    chainID: 1,
    family: 'EVM',
};

export const ROPSTEN: EVMNetwork = {
    name: 'Ropsten',
    baseAsset: ETH,
    chainID: 3,
    family: 'EVM',
};

export const OPTIMISM: EVMNetwork = {
    name: 'Optimism',
    baseAsset: ETH,
    chainID: 10,
    family: 'EVM',
};

export const POLYGON: EVMNetwork = {
    name: 'Polygon',
    baseAsset: ETH,
    chainID: 137,
    family: 'EVM',
};

export const EVMNetworks = {
    arbitrum: ARBITRUM,
    mainnet: MAINNET,
    optimism: OPTIMISM,
    polgon: POLYGON,
};

