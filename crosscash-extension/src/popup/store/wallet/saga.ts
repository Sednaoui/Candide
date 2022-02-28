import { PayloadAction } from '@reduxjs/toolkit';
import {
    all,
    call,
    put,
    takeEvery,
    spawn,
} from 'redux-saga/effects';

import { initiateWalletConnect } from '../../../lib/walletconnect';
import { createEncryptedWallet } from '../../model/wallet';
import {
    createWallet,
    createWalletconnectSession,
} from './actions';
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

function* listenWalletConnectInit({ payload }: PayloadAction<{ uri: string }>): Generator {
    try {
        yield put(createWalletconnectSession.request());
        const channel = yield call(initiateWalletConnect, payload.uri);

        yield put(createWalletconnectSession.success(channel));
    } catch (err) {
        yield put(createWalletconnectSession.success(err));
    } finally {
        yield put(createWalletconnectSession.fulfill());
    }
}

function* watchWalletConnectInit(): Generator {
    yield takeEvery(createWalletconnectSession.TRIGGER, listenWalletConnectInit);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchCreateWallet,
        watchWalletConnectInit,
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
