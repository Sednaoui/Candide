import { PayloadAction } from '@reduxjs/toolkit';

import { EthereumWallet } from '../../model/wallet';
import { createWalletAction } from './actions';

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
        case createWalletAction.TRIGGER:
            return { ...state, loading: true };
        case createWalletAction.SUCCESS:
            return {
                ...state,
                walletInstance: action.payload,
            };
        case createWalletAction.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case createWalletAction.FULFILL:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export interface WalletState {
    walletInstance: EthereumWallet;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
