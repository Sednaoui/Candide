import {
    IJsonRpcRequest,
    ISessionParams,
    IConnector,
} from '@walletconnect/types';

type RequestSessionPayload = IJsonRpcRequest & {
    params: ISessionParams[];
};

export type {
    RequestSessionPayload,
    IConnector,
};
