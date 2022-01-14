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
import { retrieveTokenBalances } from '../../model/assets';
import { getAssets } from './actions';

function* fetchGetAssets({ payload }: PayloadAction<
    { alchemyProvider: AlchemyProvider, address: HexString }
>): Generator {
    try {
        yield put(getAssets.request());
        const assets = yield call(retrieveTokenBalances, payload.alchemyProvider, payload.address);

        yield put(getAssets.success(assets));
    } catch (err) {
        yield put(getAssets.failure(err));
    } finally {
        yield put(getAssets.fulfill());
    }
}

function* watchGetAssets(): Generator {
    yield takeEvery(getAssets.TRIGGER, fetchGetAssets);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchGetAssets,
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
