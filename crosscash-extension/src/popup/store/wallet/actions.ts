import WalletConnect from '@walletconnect/client';
import { createRoutine } from 'redux-saga-routines';

import { Network } from '../../../lib/networks';
import { EthereumWallet } from '../../model/wallet';

type NetworkActionType = {
    payload: number;
    type: typeof CHANGE_NETWORK;
};

export const createWallet = createRoutine('CREATE_WALLET');

export const CHANGE_NETWORK = 'CHANGE_NETWORK';

export const changeNetwork = (chainId: number): NetworkActionType => ({
    payload: chainId,
    type: CHANGE_NETWORK,
});

export const createWalletconnectSession = createRoutine('CREATE_WALLETCONNECT_SESSION');

export type WalletPayloadAction = EthereumWallet
    & Network['chainID']
    & WalletConnect['session']
    & Error;

