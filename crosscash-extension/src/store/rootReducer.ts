
import { combineReducers } from '@reduxjs/toolkit';

import walletReducer from './wallet/reducer';

export default combineReducers({
    wallet: walletReducer,
});
