import { AlchemyProvider } from '@ethersproject/providers';
import WalletConnect from '@walletconnect/client';
import React, { useState } from 'react';
import { useProvider } from 'wagmi';

import {
    Button, Row, Col,
} from '../../components';
import { transferTokens } from '../../model/transactions';
import { decryptWallet } from '../../model/wallet';
import { useAppSelector } from '../../store';
import ConfirmModal from './ConfirmModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [walletConnector, setWalletConnector] = useState<any>();

    const [modalActive, setModalActive] = useState(false);
    const [txInfo, setTxInfo] = useState<JSON>();
    const [txApproved, setTxApproved] = useState(true);

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

        console.log('chainID baby: ', chainId);

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

                setTxInfo(tx);
                setModalActive(true);

                if (txApproved) {
                    // example with injected provider
                    // const result = await provider.send(payload.method, payload.params);
                    const { value, to } = payload.params[0];

                    const walletEXISTS = walletInstance?.address;
                    let txx;

                    if (walletEXISTS) {
                        const wallet = await decryptWallet('ass', walletInstance);

                        if (typeof wallet === 'string') {
                            txx = await transferTokens(provider, '0.0001', to, wallet);

                            console.log('just string tx: ', txx);
                        } else if (wallet && wallet.privateKey) {
                            txx = await transferTokens(
                                provider,
                                '0.0001',
                                to,
                                wallet.privateKey,
                            );
                            console.log('object tx: ', txx);
                        }
                    }

                    console.log('tx result? ', txx);

                    connector.approveRequest({
                        id: payload.id,
                        result: txx,
                    });

                    console.log('tx hash: ', txx); // TransactionDetail type is weird
                }
                // executing the transaction once getting a confirm from modal is messy,
                // will call sendTx() from ConfirmModal instead?
            } else {
                console.log('unknown method call, def check payload');
            }

            // TODO depending on accept/reject in modal, send tx with wallet provider
        });

        connector.on('disconnect', (error, payload) => {
            if (error) {
                throw error;
            }
            console.log('disconnecting ', payload);
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
                txInfo={txInfo}
                setTxApproved={setTxApproved} />
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
