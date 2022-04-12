import { PayloadAction } from '@reduxjs/toolkit';

import {
    GasSpeed,
    SET_DEFAULT_GAS_SPEED,
} from './actions';

const initialState: SettingsState = {
    defaultGasSpeed: {
        speed: 'fast',
        confidence: 99,
    },
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
        default:
            return state;
    }
};

export type SettingsState = {
    defaultGasSpeed: GasSpeed;
    loading: boolean;
    error: Error | null;
}

export default settingsReducer;
