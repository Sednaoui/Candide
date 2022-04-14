
import { combineReducers } from '@reduxjs/toolkit';

import assetReducer, { AssetState } from './assets/reducer';
import settingsReducer, { SettingsState } from './settings/reducer';
import transactionsReducer, { TransactionState } from './transactions/reducer';
import walletReducer, { WalletState } from './wallet/reducer';

export interface RootState {
    wallet: WalletState;
    assets: AssetState;
    transactions: TransactionState;
    settings: SettingsState;
}

export default combineReducers<RootState>({
    wallet: walletReducer,
    assets: assetReducer,
    transactions: transactionsReducer,
    settings: settingsReducer,
});
