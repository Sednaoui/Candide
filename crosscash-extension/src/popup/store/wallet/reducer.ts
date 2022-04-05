import { AlchemyProvider } from '@ethersproject/providers';
import { PayloadAction } from '@reduxjs/toolkit';
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
    INITIATE_WALLET_PROVIDER,
    INITIATE_DAPP_PROVIDER,
} from './actions';

const initialState: WalletState = {
    dappProvider: null,
    sessions: null,
    pendingRequest: null,
    connector: null,
    currentSessionApproved: false,
    callRequest: null,
    callRequestChainId: null,
    callRequestApproved: false,
    walletInstance: null,
    currentNetworkChainId: MAINNET.chainID,
    loading: false,
    walletProvider: null,
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
            };
        case rejectRequestSession.SUCCESS:
            return {
                ...state,
                connector: null,
                currentSessionApproved: false,
                pendingRequest: null,
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
                callRequest: action.payload.callRequest,
                callRequestChainId: action.payload.chainId,
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
        case INITIATE_WALLET_PROVIDER:
            return {
                ...state,
                walletProvider: action.payload,
            };
        case INITIATE_DAPP_PROVIDER:
            return {
                ...state,
                dappProvider: action.payload,
            };
        default:
            return state;
    }
};

export type WalletConnectSessions = {
    [key: string]: IConnector['session'];
}

export interface WalletState {
    dappProvider: AlchemyProvider | null;
    sessions: WalletConnectSessions | null;
    pendingRequest: RequestSessionPayload | null;
    connector: IConnector | null;
    currentSessionApproved: boolean;
    callRequest: IJsonRpcRequest | null;
    callRequestChainId: number | null;
    callRequestApproved: boolean;
    walletInstance: EthereumWallet | null;
    currentNetworkChainId: number;
    loading: boolean;
    walletProvider: AlchemyProvider | null;
    error: Error | null;
}

export default walletReducer;
