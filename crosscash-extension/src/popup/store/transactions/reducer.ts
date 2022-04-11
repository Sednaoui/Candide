import { PayloadAction } from '@reduxjs/toolkit';

import { AnyAssetTransfer } from '../../../lib/assets';
import { BlockPrices } from '../../../lib/networks';
import { TransactionDetail } from '../../model/transactions';
import { RESET_WALLET } from '../wallet/actions';
import {
    getTransactionDetails,
    getTransactions,
    getBlockPrices,
} from './actions';

const initialState: TransactionState = {
    transactions: [],
    transactionDetails: null,
    blockPrices: null,
    loading: false,
    error: null,
};

const transactionsReducer = (
    state = initialState,
    action: PayloadAction<AnyAssetTransfer[] & Error & TransactionDetail & BlockPrices>,
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
        case getBlockPrices.TRIGGER:
            return {
                ...state,
                loading: true,
            };
        case getBlockPrices.SUCCESS:
            return {
                ...state,
                blockPrices: action.payload,
            };
        case getBlockPrices.FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case getBlockPrices.FULFILL:
            return {
                ...state,
                loading: false,
            };
        case RESET_WALLET:
            return initialState;
        default:
            return state;
    }
};

export type TransactionState = {
    transactions: AnyAssetTransfer[];
    transactionDetails: TransactionDetail | null;
    blockPrices: BlockPrices | null;
    loading: boolean;
    error: Error | null;
};

export default transactionsReducer;
