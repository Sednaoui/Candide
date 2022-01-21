import { PayloadAction } from '@reduxjs/toolkit';

import { AnyAssetTransfer } from '../../../lib/assets';
import { TransactionDetail } from '../../model/transactions';
import {
    getTransactionDetails,
    getTransactions,
} from './actions';

const initialState: TransactionState = {
    transactions: [],
    transactionDetails: null,
    loading: false,
    error: null,
};

const transactionsReducer = (
    state = initialState,
    action: PayloadAction<AnyAssetTransfer[] & Error & TransactionDetail>,
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
        case getTransactionDetails.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case getTransactionDetails.SUCCESS:
            return {
                ...state,
                transactionDetails: action.payload,
            };
        case getTransactionDetails.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case getTransactionDetails.FULFILL:
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
    transactionDetails: TransactionDetail | null;
    loading: boolean;
    error: Error | null;
};

export default transactionsReducer;
