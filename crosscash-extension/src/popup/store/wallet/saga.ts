import { BaseProvider } from '@ethersproject/providers';
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
    select,
} from 'redux-saga/effects';

import { HexString } from '../../../lib/accounts';
import { ETH } from '../../../lib/constants/currencies';
import { populateBridgeTx } from '../../../lib/hop';
import {
    approvesSessionRequest,
    rejectSessionRequest,
    getInternalWalletConnectSessionFromUri,
    getLocalWalletConnectSession,
    initiateWalletConnect,
    disconnectSession,
    rejectCallRequest,
} from '../../../lib/walletconnect';
import {
    RequestSessionPayload,
    IConnector,
} from '../../../lib/walletconnect/types';
import {
    checkApprovalAllowenceFromTransactionRequest,
    signEthereumRequests,
} from '../../model/transactions';
import { createEncryptedWallet } from '../../model/wallet';
import {
    createWallet,
    createPendingSession,
    sendRequestSessionWithDapp,
    confirmRequestSession,
    rejectRequestSession as rejectRequestSessionAction,
    disconnectSession as disconnectSessionAction,
    callRequest as callRequestAction,
    approveCallRequest as approveCallRequestAction,
    rejectCallRequest as rejectCallRequestAction,
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
        // keep connector alive
    };
});

function* listenWalletConnectInit({ payload }: PayloadAction<{ uri: string }>): Generator {
    try {
        // Don't initiate a new session if we have already established one using this wc URI
        // TODO: type the yield calls!
        const localSession: any = yield call(getLocalWalletConnectSession, payload.uri);

        if (localSession) {
            yield put(createPendingSession.success(localSession));
        }

        // TODO: type the yield select
        const internalSessions: any = yield select((state) => state.wallet.sessions);

        const internalSession = yield call(
            getInternalWalletConnectSessionFromUri,
            internalSessions, payload.uri,
        );

        if (internalSession) {
            yield put(createPendingSession.success(internalSession));
        }

        const connector = yield call(initiateWalletConnect, payload.uri);

        yield put(createPendingSession.success(connector));

        // @ts-expect-error: TODO: type redux-saga yield call
        const channel: any = yield call(sessionRequest, connector);

        while (true) {
            const session = yield take(channel);

            // @ts-expect-error: TODO: type redux-saga yield put
            yield put(sendRequestSessionWithDapp(session));

            // close this channel when we approve a session request
            yield channel.close();
        }
    } catch (err) {
        yield put(createPendingSession.failure(err));
    } finally {
        yield put(createPendingSession.fulfill());
    }
}

function* watchWalletConnectInit(): Generator {
    yield takeEvery(createPendingSession.TRIGGER, listenWalletConnectInit);
}

const sessionDisconnect = async (connector: IConnector) => eventChannel((emitter) => {
    connector.on('disconnect', (_error, p) => {
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

function* listenWalletConnectDisconnect(): Generator {
    try {
        const connector: any = yield select((state) => state.wallet.connector);

        const channel: any = yield call(sessionDisconnect, connector);

        while (true) {
            yield take(channel);

            yield put(disconnectSessionAction.success(connector));
            yield channel.close();
        }
    } catch (err) {
        yield put(disconnectSessionAction.failure(err));
    } finally {
        yield put(disconnectSessionAction.fulfill());
    }
}

function* watchWalletConnectDisconnect(): Generator {
    yield takeEvery(confirmRequestSession.FULFILL, listenWalletConnectDisconnect);
}

function* walletConnectDisconnectSession(): Generator {
    try {
        const connector: any = yield select((state) => state.wallet.connector);

        yield call(disconnectSession, connector);
        yield put(disconnectSessionAction.success(connector));
    } catch (err) {
        yield put(disconnectSessionAction.failure(err));
    } finally {
        yield put(disconnectSessionAction.fulfill());
    }
}

function* watchWalletConnectDisconnectSession(): Generator {
    yield takeEvery(disconnectSessionAction.TRIGGER, walletConnectDisconnectSession);
}

function* walletConnectApprovesSessionRequest({ payload }: PayloadAction<{
    address: HexString,
    chainId: number,
}>): Generator {
    try {
        yield put(confirmRequestSession.request());
        const connector: any = yield select((state) => state.wallet.connector);

        yield call(approvesSessionRequest, {
            connector,
            address: payload.address,
            chainId: payload.chainId,
        });

        yield put(confirmRequestSession.success(connector));
    } catch (err) {
        yield put(confirmRequestSession.failure(err));
    } finally {
        yield put(confirmRequestSession.fulfill());
    }
}

function* watchWalletConnectApproveSessionRequest(): Generator {
    yield takeEvery(confirmRequestSession.TRIGGER, walletConnectApprovesSessionRequest);
}

function* walletConnectRejectSessionRequest(): Generator {
    try {
        const connector: any = yield select((state) => state.wallet.connector);

        yield call(rejectSessionRequest, connector);
        yield put(rejectRequestSessionAction.success());
    } catch (err) {
        yield put(rejectRequestSessionAction.failure(err));
    } finally {
        yield put(rejectRequestSessionAction.fulfill());
    }
}

function* watchWalletConnectDenySessionRequest(): Generator {
    yield takeEvery(rejectRequestSessionAction.TRIGGER, walletConnectRejectSessionRequest);
}

const callRequest = async (connector: IConnector) => eventChannel((emitter) => {
    connector.on('call_request', (_error, p) => {
        if (p) {
            emitter(p);
        } else {
            emitter(END);
        }
    });
    return () => {
        // TODO: unsubscribe from connector if we are disconnected
    };
});

function* listenWalletConnectCallRequest(): Generator {
    yield put(callRequestAction.trigger());
    const connector: any = yield select((state) => state.wallet.connector);
    const channel = yield call(callRequest, connector);

    const walletChainId: any = yield select((state) => state.wallet.currentNetworkChainId);
    const address: any = yield select((state) => state.wallet.walletInstance.address);

    while (true) {
        try {
            // @ts-expect-error:TODO: type redux-saga yield take
            const request: any = yield take(channel);

            // checks if the request is the same as the current network of the wallet
            if (connector.chainId === walletChainId) {
                // display the request to the user if same network
                yield put(callRequestAction.success({
                    callRequest: request,
                    chainId: connector.chainId,
                }));
            } else {
                // display that the request is from a different chainId

                const allowenceOk = yield call(checkApprovalAllowenceFromTransactionRequest, {
                    chainId: walletChainId,
                    transactionRequest: request,
                });

                // null returned if not transaction that requires gas is needed
                if (allowenceOk === null) {
                    // display payload directly to sign transaction
                    yield put(callRequestAction.success({
                        callRequest: request,
                        chainId: connector.chainId,
                    }));
                } else if (allowenceOk === false) {
                    // TODO: display to user that they need more allowence for hop contract bridge

                    // const amount = request.params[0].value;

                    // populates approval request tx
                    // const approvalRequest = yield call(populateApproveTx, {
                    //     chainId: walletChainId,
                    //     amount,
                    //     asset,
                    // });

                    // yield put(callRequestAction.success(approvalRequest));
                } else if (allowenceOk === true) {
                    // send the user the briding transaction to approve on hop contracts

                    const tx = yield call(populateBridgeTx, {
                        sourceChainId: walletChainId,
                        destinationChainId: connector.chainId,
                        recipient: address,
                        asset: ETH, // WARNING: only briding ETH at the moment
                        value: request.params[0].value,
                    });

                    if (tx instanceof Error) {
                        yield put(callRequestAction.failure(tx));
                        yield put(rejectCallRequestAction.trigger({
                            connector,
                            id: request.id,
                            message: tx.message,
                        }));
                    } else {
                        const bridgeRequest = {
                            id: 1, // TODO: how to set the right ID? does it matter?
                            jsonrpc: '2.0',
                            method: 'eth_sendTransaction',
                            params: [tx],
                        };

                        yield put(callRequestAction.success({
                            callRequest: bridgeRequest,
                            chainId: walletChainId,
                        }));

                        // watch for approval confirmation
                        yield take(approveCallRequestAction.FULFILL);

                        yield put(callRequestAction.success({
                            callRequest: request,
                            chainId: connector.chainId,
                        }));
                    }
                }
            }
        } catch (err) {
            yield put(callRequestAction.failure(err));
            yield put(rejectCallRequestAction.trigger({
                connector,
                message: err,
            }));
        } finally {
            yield put(callRequestAction.fulfill());
        }
    }
}

function* watchWalletConnectCallRequest(): Generator {
    yield takeEvery(confirmRequestSession.FULFILL, listenWalletConnectCallRequest);
}

function* walletConnectApproveCallRequest({ payload }: PayloadAction<{
    provider: BaseProvider,
    fromAddress: HexString,
    privateKey: string,
}>): Generator {
    const { provider, fromAddress, privateKey } = payload;
    const wallet: any = yield select((state) => state.wallet);

    const { connector } = wallet;
    const transactionRequest = wallet.callRequest;

    try {
        yield call(signEthereumRequests, {
            connector,
            transactionRequest,
            provider,
            fromAddress,
            privateKey,
        });
        yield put(approveCallRequestAction.success());
    } catch (err) {
        yield put(approveCallRequestAction.failure(err));
        yield put(rejectCallRequestAction.trigger({
            connector,
            id: transactionRequest.id,
            message: err,
        }));
    } finally {
        yield put(approveCallRequestAction.fulfill());
    }
}

function* watchWalletConnectApproveCallRequest(): Generator {
    yield takeEvery(approveCallRequestAction.TRIGGER, walletConnectApproveCallRequest);
}

function* walletConnectRejectCallRequest({ payload }: PayloadAction<{
    message?: string,
    id?: number,
}>): Generator {
    const error = payload.message || '';

    const wallet: any = yield select((state) => state.wallet);

    const id = payload.id || wallet.callRequest.id;
    const { connector } = wallet;

    try {
        yield call(rejectCallRequest, { connector, id, message: error });
        yield put(rejectCallRequestAction.success());
    } catch (err) {
        yield put(rejectCallRequestAction.failure(err));
    } finally {
        yield put(rejectCallRequestAction.fulfill());
    }
}

function* watchWalletConnectRejectCallRequest(): Generator {
    yield takeEvery(rejectCallRequestAction.TRIGGER, walletConnectRejectCallRequest);
}

export default function* logSaga(): Generator {
    const sagas = [
        watchCreateWallet,
        watchWalletConnectInit,
        watchWalletConnectApproveSessionRequest,
        watchWalletConnectDenySessionRequest,
        watchWalletConnectDisconnect,
        watchWalletConnectDisconnectSession,
        watchWalletConnectCallRequest,
        watchWalletConnectApproveCallRequest,
        watchWalletConnectRejectCallRequest,
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
