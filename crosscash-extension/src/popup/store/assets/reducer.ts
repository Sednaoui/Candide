import { PayloadAction } from '@reduxjs/toolkit';

import { AnyAssetAmount } from '../../../util/assets';
import { getAssets } from './actions';

const initialState: AssetState = {
    assets: [],
    loading: false,
    error: null,
};

export const assetReducer = (
    state = initialState,
    action: PayloadAction<AnyAssetAmount[] & Error>,
): AssetState => {
    switch (action.type) {
        case getAssets.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case getAssets.SUCCESS:
            return {
                ...state,
                assets: action.payload,
            };
        case getAssets.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case getAssets.FULFILL:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export type AssetState = {
    assets: AnyAssetAmount[];
    loading: boolean;
    error: Error | null;
}

export default assetReducer;
