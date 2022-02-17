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
    // const [connector, setConnector] = useState<any>(); // type Connector from @walletconnect/core

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConnectUrl(e.target.value);
    };

    const handleConnect = async () => {
        console.log('connect URI: ', connectUrl);

        const sessionDetails = {
            uri: connectUrl,
            clientMeta: {
                description: 'A cross-chain wallet for piggies',
                url: 'https://github.com/Sednaoui/crosscash/',
                icons: ['https://freepngimg.com/thumb/pig/15-pig-png-image.png'],
                name: 'piggycross',
            },
        };

        const connector = new WalletConnect(sessionDetails);

        if (!connector.session) {
            console.log('connecting?');
            await connector.createSession();
        }

        console.log('connector: ', connector);

        // get chainId
        const ethNetwork = getEthereumNetwork();
        const chainId = Number(ethNetwork.chainID);

        console.log('address: ', walletInstance!.address);

        // Subscribe to session requests, abstract away somewhere along with connecting?
        connector.on('session_request', (error, payload) => {
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
            console.log('session? ', connector.session);
        });

        connector.on('call_request', async (error, payload) => {
            if (error) {
                throw error;
            }

            console.log('REQUEST PERMISSION TO:', payload.params[0]);
        });

        connector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }
            console.log('disconnecting ', payload);

            setTimeout(() => {
                window.location.reload();
            }, 1);
        });
    };

    useEffect(() => {
        if (connected) {
            console.log('yay connected?');
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
