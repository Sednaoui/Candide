import { PayloadAction } from '@reduxjs/toolkit';

import { EthereumWallet } from '../../model/wallet';
import { createWallet } from './actions';

const initialState: WalletState = {
    walletInstance: null,
    loading: false,
    error: null,
};

export const walletReducer = (
    state = initialState,
    action: PayloadAction<EthereumWallet & Error>,
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
        default:
            return state;
    }
};

export interface WalletState {
    walletInstance: EthereumWallet | null;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
