
import { combineReducers } from '@reduxjs/toolkit';

import assetReducer, { AssetState } from './assets/reducer';
import walletReducer, { WalletState } from './wallet/reducer';

export interface RootState {
    wallet: WalletState;
    assets: AssetState;
}

export default combineReducers<RootState>({
    wallet: walletReducer,
    assets: assetReducer,
});
