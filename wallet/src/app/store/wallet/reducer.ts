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
    CHANGE_WALLET_CHAIN_ID,
    CHANGE_DAPP_CHAIN_ID,
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
    updateSession,
    RESET_WALLET,
    RESET_TEMP_WALLET_STATE,
    watchBridgeTransaction,
} from './actions';

const initialState: WalletState = {
    dappProvider: null,
    connectedSession: null,
    sessions: null,
    pendingRequest: null,
    connector: null,
    currentSessionApproved: false,
    callRequest: null,
    callRequestChainId: null,
    callRequestApproved: false,
    walletInstance: null,
    walletChainId: MAINNET.chainID,
    dappChainId: MAINNET.chainID,
    loading: false,
    loadingWatchBridgeTransaction: false,
    transactionHash: null,
    walletProvider: null,
    error: null,
};

export const walletReducer = (
    state = initialState,
    action: PayloadAction<WalletPayloadAction>,
): WalletState => {
    switch (action.type) {
        case RESET_TEMP_WALLET_STATE:
            return {
                ...state,
                loading: false,
                loadingWatchBridgeTransaction: false,
                transactionHash: null,
                error: null,
            };
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
        case CHANGE_WALLET_CHAIN_ID:
            return {
                ...state,
                walletChainId: action.payload,
            };
        case CHANGE_DAPP_CHAIN_ID:
            return {
                ...state,
                dappChainId: action.payload,
            };
        case updateSession.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case updateSession.SUCCESS:
            return {
                ...state,
                dappChainId: action.payload.chainId,
            };
        case updateSession.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case updateSession.FULFILL:
            return {
                ...state,
                loading: false,
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
                connectedSession: action.payload.session,
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
                connectedSession: null,
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
                transactionHash: action.payload.transactionHash,
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
        case watchBridgeTransaction.TRIGGER:
            return {
                ...state,
                loadingWatchBridgeTransaction: true,
            };
        case watchBridgeTransaction.SUCCESS:
            return {
                ...state,
            };
        case watchBridgeTransaction.FULFILL:
            return {
                ...state,
                loadingWatchBridgeTransaction: false,
            };
        case RESET_WALLET:
            return initialState;
        default:
            return state;
    }
};

export type WalletConnectSessions = {
    [key: string]: IConnector['session'];
}

export interface WalletState {
    dappProvider: AlchemyProvider | null;
    connectedSession: IConnector['session'] | null;
    sessions: WalletConnectSessions | null;
    pendingRequest: RequestSessionPayload | null;
    connector: IConnector | null;
    currentSessionApproved: boolean;
    callRequest: IJsonRpcRequest | null;
    callRequestChainId: number | null;
    callRequestApproved: boolean;
    walletInstance: EthereumWallet | null;
    walletChainId: number;
    dappChainId: number;
    loading: boolean;
    loadingWatchBridgeTransaction: boolean;
    walletProvider: AlchemyProvider | null;
    transactionHash: string | null;
    error: Error | null;
}

export default walletReducer;
