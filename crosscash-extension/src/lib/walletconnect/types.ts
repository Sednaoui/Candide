import {
    IJsonRpcRequest,
    ITxData,
    ISessionParams,
    IConnector,
    IWalletConnectOptions,
} from '@walletconnect/types';

type RequestSessionPayload = IJsonRpcRequest & {
    params: ISessionParams[];
};

type RequestTransactionPayload = IJsonRpcRequest & {
    params: ITxData[];
}

export type {
    RequestSessionPayload,
    IConnector,
    IWalletConnectOptions,
    IJsonRpcRequest,
    RequestTransactionPayload,
    ITxData,
};
