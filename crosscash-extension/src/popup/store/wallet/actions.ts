import WalletConnect from '@walletconnect/client';
import { createRoutine } from 'redux-saga-routines';

import { HexString } from '../../../lib/accounts';
import { Network } from '../../../lib/networks';
import { RequestSessionPayload } from '../../../lib/walletconnect/types';
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

export type WalletPayloadAction = EthereumWallet
    & Network['chainID']
    & WalletConnect
    & RequestSessionPayload
    & RequestSessionWithDapp
    & Error;

