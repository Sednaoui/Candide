import { EVMNetwork } from '../networks';
import { ETH } from './currencies';

export const ARBITRUM: EVMNetwork = {
    name: 'Arbitrum',
    baseAsset: ETH,
    chainID: 42161,
    family: 'EVM',
    blockExplorerUrl: 'https://arbiscan.io',
};

export const MAINNET: EVMNetwork = {
    name: 'Ethereum',
    baseAsset: ETH,
    chainID: 1,
    family: 'EVM',
    blockExplorerUrl: 'https://etherscan.io',
};

export const ROPSTEN: EVMNetwork = {
    name: 'Ropsten',
    baseAsset: ETH,
    chainID: 3,
    family: 'EVM',
    blockExplorerUrl: 'https://ropsten.etherscan.io',
};

export const OPTIMISM: EVMNetwork = {
    name: 'Optimism',
    baseAsset: ETH,
    chainID: 10,
    family: 'EVM',
    blockExplorerUrl: 'https://optimistic.etherscan.io',
};

export const POLYGON: EVMNetwork = {
    name: 'Polygon',
    baseAsset: ETH,
    chainID: 137,
    family: 'EVM',
    blockExplorerUrl: 'https://polygonscan.com',
};

export const KOVAN: EVMNetwork = {
    name: 'Kovan',
    baseAsset: ETH,
    chainID: 42,
    family: 'EVM',
    blockExplorerUrl: 'https://kovan.etherscan.io',
};

export const evmNetworks = [
    ARBITRUM,
    MAINNET,
    OPTIMISM,
    POLYGON,
    KOVAN,
];

