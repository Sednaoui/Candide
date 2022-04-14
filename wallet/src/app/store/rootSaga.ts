import { all } from 'redux-saga/effects';

import assetsSaga from './assets/saga';
import transactionsSaga from './transactions/saga';
import walletSaga from './wallet/saga';

export default function* rootSaga(): Generator {
    yield all([
        walletSaga(),
        assetsSaga(),
        transactionsSaga(),
    ]);
}
