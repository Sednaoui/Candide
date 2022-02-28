import WalletConnect from '@walletconnect/client';

export const getSessionDetails = (uri: string) => ({
    uri,
    clientMeta: {
        description: 'A cross-chain wallet for piggies',
        icons: ['https://freepngimg.com/thumb/pig/15-pig-png-image.png'],
        name: 'piggycross',
        ssl: true,
        url: 'https://github.com/Sednaoui/crosscash/',
    },
});

export const initiateWalletConnect = async (uri: string) => {
    try {
        const details = getSessionDetails(uri);
        const walletConnector = new WalletConnect(details);

        if (!walletConnector.session) {
            await walletConnector.createSession();
        }

        return walletConnector.session;
    } catch (err) {
        return err;
    }
};
