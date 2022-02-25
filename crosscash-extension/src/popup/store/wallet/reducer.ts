import { PayloadAction } from '@reduxjs/toolkit';

import { MAINNET } from '../../../lib/constants/networks';
import { EthereumWallet } from '../../model/wallet';
import {
    createWallet,
    CHANGE_NETWORK,
    WalletPayloadAction,
} from './actions';

const initialState: WalletState = {
    walletInstance: null,
    currentNetworkChainId: MAINNET.chainID,
    loading: false,
    error: null,
};

export const walletReducer = (
    state = initialState,
    action: PayloadAction<WalletPayloadAction>,
): WalletState => {
    switch (action.type) {
        case createWallet.TRIGGER:
            return { ...state, loading: true };
        case createWallet.SUCCESS:
            return {
                ...state,
                walletInstance: action.payload,
            };
        case createWallet.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case createWallet.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case CHANGE_NETWORK:
            return {
                ...state,
                currentNetworkChainId: action.payload,
            };
        default:
            return state;
    }
};

export interface WalletState {
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
