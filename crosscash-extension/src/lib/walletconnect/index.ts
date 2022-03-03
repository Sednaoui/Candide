import WalletConnect from '@walletconnect/client';
import { parseWalletConnectUri } from '@walletconnect/utils';

import { WalletConnectSessions } from '../../popup/store/wallet/reducer';
import { HexString } from '../accounts';
import {
    getLocal,
    removeLocal,
} from '../utils/localStorage';
import {
    IConnector,
    IWalletConnectOptions,
} from './types';

const WALLETCONNECT = 'walletconnect';

export const getSessionDetails = (uri: string): IWalletConnectOptions => ({
    uri,
    clientMeta: {
        description: 'A cross-chain wallet for piggies',
        icons: ['https://freepngimg.com/thumb/pig/15-pig-png-image.png'],
        name: 'piggycross',
        url: 'https://github.com/Sednaoui/crosscash/',
    },
});

export const initiateWalletConnect = async (uri: string): Promise<IConnector> => {
    const details = getSessionDetails(uri);

    // this rm walletconnect localstorage sessions. doesn't rm intenral redux store sessions
    removeLocal(WALLETCONNECT);

    const walletConnector = new WalletConnect(details);

    return walletConnector;
};

export const getLocalWalletConnectSession = async (uri: string): Promise<IConnector | null> => {
    const localSession = await getValidWalletConnectSession();

    const wcUri = parseWalletConnectUri(uri);

    if (localSession) {
        const alreadyConnected = (localSession.handshakeTopic === wcUri.handshakeTopic)
            && (localSession.key === wcUri.key);

        if (alreadyConnected) {
            return new WalletConnect({ session: localSession });
        }
    }
    return null;
};

/**
 * Get all valid connected walletconnect sessions
 * @return {Object}
 */
export const getValidWalletConnectSession = async () => {
    // TODO: only returns a single session. How can we get and store multiple sessions?
    const session = await getLocal(WALLETCONNECT);

    if (session) {
        if (session.connected) {
            return session;
        }
    } else {
        return null;
    }
    return null;
};

export const getInternalWalletConnectSessionFromUri = async (
    sessions: WalletConnectSessions, uri: string,
): Promise<IConnector | null> => {
    const wcUri = parseWalletConnectUri(uri);

    // find out if we have a session with the same key
    try {
        const session = sessions[wcUri.key];

        if (session) {
            return new WalletConnect({ session });
        }
    } catch (err) {
        return null;
    }

    return null;
};

export const approvesSessionRequest = async ({ connector, address, chainId }: {
    connector: IConnector,
    address: HexString,
    chainId: number,
}): Promise<void> => connector.approveSession({
    chainId,
    accounts: [address],
});

export const rejectSessionRequest = async (connector: IConnector) =>
    connector.rejectSession({ message: 'USER_DENIED_SESSION' });

export const disconnectSession = async (connector: IConnector) => {
    await connector.killSession();
};
