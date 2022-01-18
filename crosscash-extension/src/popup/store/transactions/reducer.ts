import { PayloadAction } from '@reduxjs/toolkit';

import { AnyAssetTransfer } from '../../../lib/assets';
import { getTransactions } from './actions';

const initialState: TransactionState = {
    transactions: [],
    loading: false,
    error: null,
};

const transactionsReducer = (
    state = initialState,
    action: PayloadAction<AnyAssetTransfer[] & Error>,
): TransactionState => {
    switch (action.type) {
        case getTransactions.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case getTransactions.SUCCESS:
            return {
                ...state,
                transactions: action.payload,
            };
        case getTransactions.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case getTransactions.FULFILL:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};

export type TransactionState = {
    transactions: AnyAssetTransfer[];
    loading: boolean;
    error: Error | null;
};

export default transactionsReducer;
