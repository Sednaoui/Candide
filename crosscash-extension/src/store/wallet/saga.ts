import { PayloadAction } from '@reduxjs/toolkit';
import {
    all,
    call,
    put,
    takeEvery,
    spawn,
} from 'redux-saga/effects';

import { createEncryptedWallet } from '../../model/wallet';
import { createWallet } from './actions';
import { EncryptedWallet } from './type';

function* fetchCreateWallet({ payload }: PayloadAction<EncryptedWallet>): Generator {
    try {
        yield put(createWallet.request());
        const wallet = yield call(createEncryptedWallet, payload.password, payload.mnemonic);

        yield put(createWallet.success(wallet));
    } catch (err) {
        yield put(createWallet.failure(err));
    } finally {
        yield put(createWallet.fulfill());
    }
}

function* watchCreateWallet(): Generator {
    yield takeEvery(createWallet.TRIGGER, fetchCreateWallet);
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
