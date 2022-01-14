import { EVMNetwork } from '../networks';
import { ETH } from './currencies';

export const MAINNET: EVMNetwork = {
    name: 'Mainnet',
    baseAsset: ETH,
    chainID: '1',
    family: 'EVM',
};

export const ROPSTEN: EVMNetwork = {
    name: 'Ropsten',
    baseAsset: ETH,
    chainID: '3',
    family: 'EVM',
};

