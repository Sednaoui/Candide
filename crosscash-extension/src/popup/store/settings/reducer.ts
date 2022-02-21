import { PayloadAction } from '@reduxjs/toolkit';

import { MAINNET } from '../../../lib/constants/networks';
import {
    GasSpeed,
    SET_DEFAULT_GAS_SPEED,
    CHANGE_NETWORK,
} from './actions';

const initialState: SettingsState = {
    defaultGasSpeed: {
        speed: 'fast',
        confidence: 99,
    },
    currentNetworkChainId: MAINNET.chainID,
    loading: false,
    error: null,
};

const settingsReducer = (
    state = initialState,
    action: PayloadAction<GasSpeed & number & Error>,
): SettingsState => {
    switch (action.type) {
        case SET_DEFAULT_GAS_SPEED:
            return {
                ...state,
                defaultGasSpeed: action.payload,
            };
        case CHANGE_NETWORK:
            return {
                ...state,
                currentNetworkChainId: action.payload,
            };
        default:
            return state;
    }
};

export type SettingsState = {
    defaultGasSpeed: GasSpeed;
    loading: boolean;
    currentNetworkChainId: number;
    error: Error | null;
}

export default settingsReducer;
