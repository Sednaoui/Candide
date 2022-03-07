import {
    IJsonRpcRequest,
    ISessionParams,
    IConnector,
    IWalletConnectOptions,
} from '@walletconnect/types';

type RequestSessionPayload = IJsonRpcRequest & {
    params: ISessionParams[];
};

export type {
    RequestSessionPayload,
    IConnector,
    IWalletConnectOptions,
    IJsonRpcRequest,
};
