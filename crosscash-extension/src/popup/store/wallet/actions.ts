import { AlchemyProvider } from '@ethersproject/providers';
import WalletConnect from '@walletconnect/client';
import { createRoutine } from 'redux-saga-routines';

import { HexString } from '../../../lib/accounts';
import { Network } from '../../../lib/networks';
import {
    RequestSessionPayload,
    IJsonRpcRequest,
} from '../../../lib/walletconnect/types';
import { EthereumWallet } from '../../model/wallet';

type NetworkActionType = {
    payload: number;
    type: typeof CHANGE_NETWORK;
};

type RequestSessionWithDapp = {
    connector: WalletConnect,
    address: HexString,
    chainId: number,
}

type ProviderActionType = {
    payload: AlchemyProvider;
    type: typeof INITIATE_WALLET_PROVIDER;
};

export const createWallet = createRoutine('CREATE_WALLET');

export const CHANGE_NETWORK = 'CHANGE_NETWORK';

export const changeNetwork = (chainId: number): NetworkActionType => ({
    payload: chainId,
    type: CHANGE_NETWORK,
});
// create a pending walletconnect session to send a request for user confirmation
export const createPendingSession = createRoutine(
    'CREATE_PENDING_WALLETCONNECT_SESSION',
);

// Send a pending request to connect with dapp
export const SEND_REQUEST_SESSION_WITH_DAPP = 'SEND_REQUEST_SESSION_WITH_DAPP';
export const sendRequestSessionWithDapp = (
    payload: RequestSessionPayload,
) => ({
    payload,
    type: SEND_REQUEST_SESSION_WITH_DAPP,
});

// confirm a pending request to connect with dapp
export const confirmRequestSession = createRoutine('CONFIRM_REQUEST_SESSION_WITH_DAPP');

// deny a pending request to connect with dapp
export const rejectRequestSession = createRoutine('REJECT_REQUEST_SESSION_WITH_DAPP');

// disconnect from walletconnect
export const disconnectSession = createRoutine('DISCONNECT_SESSION');

// listen for callRequest
export const callRequest = createRoutine('CALL_REQUEST');

// approve or reject call requests
export const approveCallRequest = createRoutine('APPROVE_CALL_REQUEST');
export const rejectCallRequest = createRoutine('REJECT_CALL_REQUEST');

// wallet provider
export const INITIATE_WALLET_PROVIDER = 'INITIATE_WALLET_PROVIDER';

export const initiateWalletProvider = (provider: AlchemyProvider): ProviderActionType => ({
    payload: provider,
    type: INITIATE_WALLET_PROVIDER,
});

export const initiateProvider = (provider: AlchemyProvider): ProviderActionType => ({
    payload: provider,
    type: INITIATE_PROVIDER,
});

export type WalletPayloadAction = EthereumWallet
    & Network['chainID']
    & WalletConnect
    & RequestSessionPayload
    & RequestSessionWithDapp
    & IJsonRpcRequest
    & AlchemyProvider
    & Error;

