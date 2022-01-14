import { CURRENT_NETWORK } from '../popup/model/constants';
import {
    MAINNET,
    ROPSTEN,
} from './constants/networks';
import { EVMNetwork } from './networks';

/**
 * trancats an address to 8 bytes, and pads the rest with four dots
 */
export const trancatAddress = (address: string): string => (
    `${address.substring(0, 4)}...${address.substring(address.length - 4)}`
);

/**
 * Determine which Ethereum network should be used based on the .env file
 */
export function getEthereumNetwork(): EVMNetwork {
    const ethereumNetwork = CURRENT_NETWORK.toUpperCase();

    if (ethereumNetwork === 'MAINNET') {
        return MAINNET;
    }

    if (ethereumNetwork === 'ROPSTEN') {
        return ROPSTEN;
    }

    // Default to ROPSTEN
    return ROPSTEN;
}

