
import { combineReducers } from '@reduxjs/toolkit';

import assetReducer, { AssetState } from './assets/reducer';
import transactionsReducer, { TransactionState } from './transactions/reducer';
import walletReducer, { WalletState } from './wallet/reducer';

export interface RootState {
    wallet: WalletState;
    assets: AssetState;
    transactions: TransactionState;
}

export default combineReducers<RootState>({
    wallet: walletReducer,
    assets: assetReducer,
    transactions: transactionsReducer,
});
