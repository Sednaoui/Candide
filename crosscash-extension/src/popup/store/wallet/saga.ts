import { PayloadAction } from '@reduxjs/toolkit';
import {
    eventChannel,
    END,
    EventChannel,
} from 'redux-saga';
import {
    all,
    call,
    put,
    takeEvery,
    spawn,
    take,
} from 'redux-saga/effects';

import { HexString } from '../../../lib/accounts';
import {
    getLocalWalletConnectSession,
    initiateWalletConnect,
} from '../../../lib/walletconnect';
import {
    RequestSessionPayload,
    IConnector,
} from '../../../lib/walletconnect/types';
import { createEncryptedWallet } from '../../model/wallet';
import {
    createWallet,
    createPendingSession,
    sendRequestSessionWithDapp,
    CONFIRM_REQUEST_SESSION_WITH_DAPP,
    DENY_REQUEST_SESSION_WITH_DAPP,
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

const sessionRequest = async (
    connector: IConnector,
): Promise<EventChannel<RequestSessionPayload>> => eventChannel((emitter) => {
    connector.on('session_request', (_error, p: RequestSessionPayload) => {
        if (p) {
            emitter(p);
        } else {
            emitter(END);
        }
    });
    return () => {
        // unsubscribe from connector once saga is cancelled
        connector.killSession();
    };
});

function* listenWalletConnectInit({ payload }: PayloadAction<{ uri: string }>): Generator {
    try {
        // Don't initiate a new session if we have already established one using this wc URI
        // TODO: type the yield calls!
        const localSession: any = yield call(getLocalWalletConnectSession, payload.uri);

        if (localSession) {
            return yield put(createPendingSession.success(localSession));
        }

        const connector = yield call(initiateWalletConnect, payload.uri);

        yield put(createPendingSession.success(connector));

        // @ts-expect-error: TODO: type redux-saga yield call
        const channel = yield call(sessionRequest, connector);

        while (true) {
            // @ts-expect-error: TODO: type redux-saga yield take
            const session = yield take(channel);

            // @ts-expect-error: TODO: type redux-saga yield put
            yield put(sendRequestSessionWithDapp(session));
        }
    } catch (err) {
        return yield put(createPendingSession.failure(err));
    } finally {
        yield put(createPendingSession.fulfill());
    }
}

function approvesSessionRequest({ payload }: PayloadAction<{
    connector: IConnector,
    address: HexString,
    chainId: number,
}>) {
    try {
        return payload.connector.approveSession({
            chainId: payload.chainId,
            accounts: [payload.address],
        });
    } catch (err) {
        return err;
    }
}

function* watchWalletConnectApproveSessionRequest(): Generator {
    yield takeEvery(CONFIRM_REQUEST_SESSION_WITH_DAPP, approvesSessionRequest);
}

function denySessionRequest({ payload }: PayloadAction<{ connector: IConnector }>) {
    try {
        return payload.connector.rejectSession({ message: 'USER_DENIED_REQUEST' });
    } catch (err) {
        return err;
    }
}

function* watchWalletConnectDenySessionRequest(): Generator {
    yield takeEvery(DENY_REQUEST_SESSION_WITH_DAPP, denySessionRequest);
}

function* watchWalletConnectInit(): Generator {
    yield takeEvery(createPendingSession.TRIGGER, listenWalletConnectInit);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchCreateWallet,
        watchWalletConnectInit,
        watchWalletConnectApproveSessionRequest,
        watchWalletConnectDenySessionRequest,
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
