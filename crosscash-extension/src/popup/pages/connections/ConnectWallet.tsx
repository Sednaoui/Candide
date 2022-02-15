import WalletConnect from '@walletconnect/client';
import React, {
    useEffect, useState,
} from 'react';

import { getEthereumNetwork } from '../../../lib/helpers';
import { Button } from '../../components';
import { useAppSelector } from '../../store';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [connected, setConnected] = useState<boolean>();
    const [connector, setConnector] = useState<any>(); // type Connector from @walletconnect/core

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConnectUrl(e.target.value);
    };

    const handleConnect = () => {
        console.log('hey dickface:: ', connectUrl);

        const sessionDetails = {
            uri: connectUrl,
            clientMeta: {
                description: 'A cross-chain wallet for piggies',
                url: 'https://github.com/Sednaoui/crosscash/',
                icons: ['https://freepngimg.com/thumb/pig/15-pig-png-image.png'],
                name: 'piggycross',
            },
        };

        const conn = new WalletConnect(sessionDetails);

        setConnector(conn);
        console.log('connector: ', conn);

        // get chainId
        const ethNetwork = getEthereumNetwork();
        const chainId = ethNetwork.chainID;

        // Subscribe to session requests, abstract away somewhere along with connecting?
        connector.on('session_request', (error: any, payload: any) => {
            if (error) {
                throw error;
            }

            console.log('session payload? ', payload);

            connector.approveSession({
                accounts: [
                    walletInstance!.address,
                ],
                chainId,
            });
            setConnected(true);
        });
    };

    useEffect(() => {
        if (connected) {
            console.log('yay connected!', connector);
        } else {
            console.log('no not connected...');
        }
    }, [connectUrl]);

    return (
        <div>
            <input
                name="connectUrl"
                type="text"
                placeholder="enter walletconnect url (copy QR-code)"
                onChange={handleChange} />
            <Button
                type="button"
                className="btn-primary"
                onClick={handleConnect}>
                Connect
            </Button>
        </div>
    );
};

export default ConnectWallet;
