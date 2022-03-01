import { PayloadAction } from '@reduxjs/toolkit';
import WalletConnect from '@walletconnect/client';

import { MAINNET } from '../../../lib/constants/networks';
import { RequestSessionPayload } from '../../../lib/walletconnect/types';
import { EthereumWallet } from '../../model/wallet';
import {
    createWallet,
    createPendingSession,
    CHANGE_NETWORK,
    WalletPayloadAction,
    SEND_REQUEST_SESSION_WITH_DAPP,
    CONFIRM_REQUEST_SESSION_WITH_DAPP,
    DENY_REQUEST_SESSION_WITH_DAPP,
} from './actions';

type WalletConnectSession = {
    [peerId: string]: WalletConnect;
}

const initialState: WalletState = {
    sessions: null,
    pendingRequest: null,
    pendingConnector: null,
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
        case createPendingSession.TRIGGER:
            return { ...state, loading: true };
        case createPendingSession.SUCCESS:
            return {
                ...state,
                pendingConnector: action.payload,
            };
        case createPendingSession.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case createPendingSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case SEND_REQUEST_SESSION_WITH_DAPP:
            return {
                ...state,
                pendingRequest: action.payload,
            };
        case CONFIRM_REQUEST_SESSION_WITH_DAPP:
            return {
                ...state,
                pendingRequest: null,
                pendingConnector: null,
                sessions: {
                    ...state.sessions,
                    [action.payload.connector.peerId]: action.payload.connector,
                },
            };
        case DENY_REQUEST_SESSION_WITH_DAPP:
            return {
                ...state,
                pendingRequest: null,
                pendingConnector: null,
            };
        default:
            return state;
    }
};

export interface WalletState {
    sessions: WalletConnectSession | null;
    pendingRequest: RequestSessionPayload | null;
    pendingConnector: WalletConnect | null;
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    error: Error | null;
}

export default walletReducer;
