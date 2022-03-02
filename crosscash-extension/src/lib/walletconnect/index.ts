import WalletConnect from '@walletconnect/client';

import {
    getLocal,
    removeLocal,
} from '../utils/localStorage';
import {
    IConnector,
    IWalletConnectOptions,
} from './types';

const WALLETCONNECT = 'walletconnect';

/**
 * Get all walletconnect sessions
 * @return {Object}
 */
const getAllWalletConnectSessions = () => getLocal(WALLETCONNECT);

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

    // TODO: this deletes all wallet connect sessions. Need to figure out how to
    //       handle multiple wallet connect sessions
    removeLocal(WALLETCONNECT);

    const walletConnector = new WalletConnect(details);

    return walletConnector;
};

/**
 * Get all valid connected walletconnect sessions
 * @return {Object}
 */
export const getAllValidWalletConnectSessions = async () => {
    // TODO: only returns a single session. How can we get and store multiple sessions?
    const allSessions = await getAllWalletConnectSessions();

    return allSessions;
};
