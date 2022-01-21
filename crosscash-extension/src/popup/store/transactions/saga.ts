import { AlchemyProvider } from '@ethersproject/providers';
import { PayloadAction } from '@reduxjs/toolkit';
import {
    all,
    call,
    put,
    takeEvery,
    spawn,
} from 'redux-saga/effects';

import { HexString } from '../../../lib/accounts';
import {
    getTransactionHistory,
    getTransactionDetails,
} from '../../model/transactions';
import {
    getTransactions,
    getTransactionDetails as getTransactionDetailsAction,
} from './actions';

function* fetchGetTransactions({ payload }: PayloadAction<{
    address: HexString,
    provider: AlchemyProvider
}>): Generator {
    try {
        yield put(getTransactions.request());
        const wallet = yield call(getTransactionHistory, payload.provider, payload.address);

        yield put(getTransactions.success(wallet));
    } catch (err) {
        yield put(getTransactions.failure(err));
    } finally {
        yield put(getTransactions.fulfill());
    }
}

function* watchGetTransactions(): Generator {
    yield takeEvery(getTransactions.TRIGGER, fetchGetTransactions);
}

function* fetchGetTransactionDetails({ payload }: PayloadAction<{
    provider: AlchemyProvider,
    transactionHash: HexString,
}>): Generator {
    try {
        yield put(getTransactionDetailsAction.request());
        const wallet = yield call(getTransactionDetails, payload.provider, payload.transactionHash);

        yield put(getTransactionDetailsAction.success(wallet));
    } catch (err) {
        yield put(getTransactionDetailsAction.failure(err));
    } finally {
        yield put(getTransactionDetailsAction.fulfill());
    }
}

function* watchGetTransactionDetails(): Generator {
    yield takeEvery(getTransactionDetailsAction.TRIGGER, fetchGetTransactionDetails);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchGetTransactions,
        watchGetTransactionDetails,
    ];

    yield all(sagas.map((saga) => (
        spawn(function* callSaga() {
            while (true) {
                try {
                    yield call(saga);
                    break;
                } catch (e) {
                    console.error(e);
                }
            }
        }))));
}
