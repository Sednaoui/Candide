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
import { getTransactionHistory } from '../../model/transactions';
import { getTransactions } from './actions';

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

export default function* logSaga(): Generator {
    const sagas = [
        watchGetTransactions,
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
