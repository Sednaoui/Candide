import { AlchemyProvider } from '@ethersproject/providers';
import WalletConnect from '@walletconnect/client';
import React, { useState } from 'react';
import { useProvider } from 'wagmi';

import {
    Button, Row, Col,
} from '../../components';
import { useAppSelector } from '../../store';
import ConfirmModal from './ConfirmModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [walletConnector, setWalletConnector] = useState<any>();

    const [modalActive, setModalActive] = useState(false);
    const [txInfo, setTxInfo] = useState<JSON>();

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const provider = useProvider() as AlchemyProvider;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConnectUrl(e.target.value);
    };

    const handleConnect = async () => {
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

        setWalletConnector(connector);

        // hack for testing
        (window as any).walletconnect = connector;

        if (!connector.session) {
            console.log('connecting?');
            await connector.createSession();
        }

        console.log('connector: ', connector);

        // get chainId
        const { chainId } = provider.network;

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

            console.log('session? ', connector.session);
        });

        connector.on('call_request', async (error, payload) => {
            if (error) {
                throw error;
            }

            console.log('REQUEST PERMISSION TO:', payload.params[0]);

            const tx = payload.params;

            setTxInfo(tx);
            setModalActive(true);

            setTimeout(() => {
                setModalActive(false);
            }, 10000);

            // TODO depending on accept/reject in modal, send tx with wallet provider
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

    const handleDisconnect = async () => {
        if (walletConnector) {
            walletConnector.killSession();
        } else {
            console.log('connector not accessable in state');
        }
    };

    return (
        modalActive ? (
            <ConfirmModal
                modalActive={modalActive}
                setModalActive={setModalActive}
                txInfo={txInfo} />
        )
            : (
                <Row>
                    <Col>
                        <input
                            name="connectUrl"
                            type="text"
                            placeholder="enter walletconnect url (copy QR-code)"
                            onChange={handleChange} />
                    </Col>
                    <Col>
                        <Button
                            type="button"
                            className="btn-primary"
                            onClick={handleConnect}>
                            Connect
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="button"
                            className="btn-secondary"
                            onClick={handleDisconnect}>
                            Disconnect
                        </Button>
                    </Col>
                </Row>
            )
    );
};

export default ConnectWallet;
