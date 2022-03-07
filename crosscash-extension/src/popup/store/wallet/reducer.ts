import { PayloadAction } from '@reduxjs/toolkit';
import WalletConnect from '@walletconnect/client';
import { omit } from 'lodash';

import { MAINNET } from '../../../lib/constants/networks';
import {
    RequestSessionPayload,
    IConnector,
    IJsonRpcRequest,
} from '../../../lib/walletconnect/types';
import { EthereumWallet } from '../../model/wallet';
import {
    createWallet,
    createPendingSession,
    CHANGE_NETWORK,
    WalletPayloadAction,
    SEND_REQUEST_SESSION_WITH_DAPP,
    confirmRequestSession,
    rejectRequestSession,
    disconnectSession,
    callRequest,
    approveCallRequest,
    rejectCallRequest,
} from './actions';

const initialState: WalletState = {
    sessions: null,
    pendingRequest: null,
    connector: null,
    currentSessionApproved: false,
    callRequest: null,
    callRequestApproved: false,
    walletInstance: null,
    currentNetworkChainId: MAINNET.chainID,
    loading: false,
    error: null,
    modalDisplay: null,
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
                connector: action.payload,
            };
        case createPendingSession.FAILURE:
            return {
                ...state,
                connector: null,
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
        case confirmRequestSession.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case confirmRequestSession.REQUEST:
            return {
                ...state,
                pendingRequest: null,
            };
        case confirmRequestSession.SUCCESS:
            return {
                ...state,
                currentSessionApproved: true,
                sessions: {
                    ...state.sessions,
                    [action.payload.key]: action.payload.session,
                },
            };
        case confirmRequestSession.FAILURE:
            return {
                ...state,
                connector: null,
                error: action.payload,
            };
        case confirmRequestSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case rejectRequestSession.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case rejectRequestSession.REQUEST:
            return {
                ...state,
                pendingRequest: null,
            };
        case rejectRequestSession.SUCCESS:
            return {
                ...state,
                connector: null,
                currentSessionApproved: false,
            };
        case rejectRequestSession.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case rejectRequestSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        // disconnect
        case disconnectSession.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case disconnectSession.SUCCESS:
            return {
                ...state,
                connector: null,
                currentSessionApproved: false,
                sessions: omit(state.sessions, action.payload.key),
            };
        case disconnectSession.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case disconnectSession.FULFILL:
            return {
                ...state,
                loading: false,
            };
        // call request: listen to incoming transactions
        case callRequest.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case callRequest.SUCCESS:
            return {
                ...state,
                callRequest: action.payload,
            };
        case callRequest.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case callRequest.FULFILL:
            return {
                ...state,
                loading: false,
            };
        // approve call request
        case approveCallRequest.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case approveCallRequest.SUCCESS:
            return {
                ...state,
                callRequestApproved: true,
            };
        case approveCallRequest.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case approveCallRequest.FULFILL:
            return {
                ...state,
                callRequest: null,
                loading: false,
            };
        // reject call request
        case rejectCallRequest.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case rejectCallRequest.SUCCESS:
            return {
                ...state,
                callRequestApproved: false,
            };
        case rejectCallRequest.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case rejectCallRequest.FULFILL:
            return {
                ...state,
                callRequest: null,
                loading: false,
            };
        default:
            return state;
    }
};

export type WalletConnectSessions = {
    [key: string]: IConnector['session'];
}

export interface ConfirmSessionInfo {
    name: string;
    url: string;
    chainId: number | null;
    icons: string[] | null;
}

export interface WalletState {
    sessions: WalletConnectSessions | null;
    pendingRequest: RequestSessionPayload | null;
    connector: WalletConnect | null;
    currentSessionApproved: boolean;
    callRequest: IJsonRpcRequest | null;
    callRequestApproved: boolean;
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    error: Error | null;
    modalDisplay: ConfirmSessionInfo | null;
}

export default walletReducer;
