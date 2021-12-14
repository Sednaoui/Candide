import { PayloadAction } from '@reduxjs/toolkit';
import {
    all,
    call,
    put,
    takeEvery,
    spawn,
} from 'redux-saga/effects';

import {
    createWallet,
    EthereumMnemonic,
} from '../../model/wallet';
import { createWalletAction } from './actions';

function* fetchCreateWallet({ payload }: PayloadAction<EthereumMnemonic>): Generator {
    try {
        yield put(createWalletAction.request());
        const wallet = yield call(createWallet, payload);

        yield put(createWalletAction.success(wallet));
    } catch (err) {
        yield put(createWalletAction.failure(err));
    } finally {
        yield put(createWalletAction.fulfill());
    }
}

function* watchCreateWallet(): Generator {
    yield takeEvery(createWalletAction.TRIGGER, fetchCreateWallet);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchCreateWallet,
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
