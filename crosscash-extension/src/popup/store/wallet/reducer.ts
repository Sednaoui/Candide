import { PayloadAction } from '@reduxjs/toolkit';
import WalletConnect from '@walletconnect/client';

import { MAINNET } from '../../../lib/constants/networks';
import { EthereumWallet } from '../../model/wallet';
import {
    createWallet,
    createWalletconnectSession,
    CHANGE_NETWORK,
    WalletPayloadAction,
} from './actions';

type WalletConnectSession = {
    [peerId: string]: WalletConnect['session'];
}

const initialState: WalletState = {
    sessions: null,
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
        case createWalletconnectSession.TRIGGER:
            return { ...state, loading: true };
        case createWalletconnectSession.SUCCESS:
            return {
                ...state,
                sessions: {
                    ...state.sessions,
                    [action.payload.peerId]: action.payload,
                },
            };
        case createWalletconnectSession.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case createWalletconnectSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export interface WalletState {
    sessions: WalletConnectSession | null;
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
