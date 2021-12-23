
import { combineReducers } from '@reduxjs/toolkit';

import walletReducer, { WalletState } from './wallet/reducer';

export interface RootState {
    wallet: WalletState;
}

export default combineReducers<RootState>({
    wallet: walletReducer,
});
