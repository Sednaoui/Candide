import { createRoutine } from 'redux-saga-routines';

export const getTransactions = createRoutine('GET_TRANSACTIONS');

export const getTransactionDetails = createRoutine('GET_TRANSACTION_DETAILS');
