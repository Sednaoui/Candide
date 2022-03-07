import { AlchemyProvider } from '@ethersproject/providers';
import WalletConnect from '@walletconnect/client';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useProvider } from 'wagmi';

import {
    Button, Row, Col,
} from '../../components';
import { sendTx } from '../../model/transactions';
import {
    decryptWallet,
    EthereumWallet,
} from '../../model/wallet';
import { useAppSelector } from '../../store';
import {
    createPendingSession, confirmRequestSession,
    rejectRequestSession,
} from '../../store/wallet/actions';
import { confirmation } from './ConfirmModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [walletConnector, setWalletConnector] = useState<WalletConnect>();

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const wallet = useAppSelector((state) => state.wallet)
    const dispatch = useDispatch();
    const provider = useProvider() as AlchemyProvider;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConnectUrl(e.target.value);
    };

    const handleNewConnect = async () => {
        const sessionDetails = {
            uri: connectUrl,
            clientMeta: {
                description: 'A cross-chain wallet for piggies',
                url: 'https://github.com/Sednaoui/crosscash/',
                icons: ['https://freepngimg.com/thumb/pig/15-pig-png-image.png'],
                name: 'piggycross',
            },
        };

        console.log('dispatching .TRIGGER');
        await dispatch(createPendingSession(sessionDetails));
    };

    const confirmSessh = async () => {
        console.log('dispatching confirmSession.Trigger?');

        const add = walletInstance!.address;
        const chain = wallet.currentNetworkChainId; // works, think about where to store all this

        const payloadObj = {
            address: add,
            chainId: chain,
        };

        dispatch(confirmRequestSession(payloadObj));
    };

    const denySessh = async () => {
        console.log('dispatching denySession.Trigger?');
        dispatch(rejectRequestSession());
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

        if (!connector.session) {
            console.log('connecting');
            await connector.createSession();
        }

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
        });

        connector.on('call_request', async (error, payload) => {
            if (error) {
                throw error;
            }

            console.log('the whole payload: ', payload);

            // different possibilities

            if (payload.method === 'wallet_addEthereumChain'
            || payload.method === 'wallet_switchEthereumChain') {
                console.log('switching chains?!');
            } else if (payload.method === 'eth_signTypedData') {
                console.log('signing typed data?!');
            } else if (payload.method === 'personal_sign') {
                console.log('personal sign also?!');
            } else if (payload.method === 'eth_sendTransaction') {
                const tx = payload.params;

                const isConfirmed = await confirmation({ txInfo: tx });

                if (isConfirmed) {
                    // example with injected provider
                    // const result = await provider.send(payload.method, payload.params);
                    const { value, to, data, gas } = payload.params[0];

                    if (typeof walletInstance === 'string') {
                        console.log('wrong password bitch.');
                    } else if (walletInstance && walletInstance.privateKey) {
                        const wallet = await decryptWallet('ass', walletInstance) as EthereumWallet;

                        const txResult = await sendTx(provider,
                                                      data,
                                                      value,
                                                      to,
                                                      gas,
                                                      wallet.privateKey);

                        console.log('txResult? ', txResult);

                        connector.approveRequest({
                            id: payload.id,
                            result: txResult,
                        });
                    }
                } else {
                    connector.rejectRequest({
                        id: payload.id,
                        error: {
                            code: 69,
                            message: 'lol user denied u too bad',
                        },
                    });
                }
            } else {
                console.log('unknown method call, def check payload');
            }
        });

        connector.on('disconnect', async (error, payload) => {
            if (error) {
                throw error;
            }
            console.log('disconnecting ', payload);
            await handleDisconnect();
        });
    };

    const handleDisconnect = async () => {
        if (walletConnector) {
            walletConnector.killSession();
        }
    };

    return (
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
                    onClick={handleNewConnect}>
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
            <Col>
                <Button
                    type="button"
                    className="btn-secondary"
                    onClick={confirmSessh}>
                    confirm
                </Button>
            </Col>
            <Col>
                <Button
                    type="button"
                    className="btn-secondary"
                    onClick={denySessh}>
                    deny
                </Button>
            </Col>
        </Row>
    );
};

export default ConnectWallet;
