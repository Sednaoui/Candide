import React, {
    useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { initiateNewProvider } from '../../../lib/alchemy';
import { getEthereumNetwork } from '../../../lib/helpers';
import {
    Button,
    Stack,
    Form,
    CloseButton,
} from '../../components';
import QrReader from '../../components/QrReader/QRReader';
import { useAppSelector } from '../../store';
import {
    changeDappChainId,
    createPendingSession,
    initiateDappProvider,
} from '../../store/wallet/actions';
import SessionModal, { SessionInfo } from './SessionModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState('');
    const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

    const pendingRequest = useAppSelector((state) => state.wallet.pendingRequest);
    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);

    const address = walletInstance?.address;
    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);

    const dispatch = useDispatch();

    useEffect(() => {
        if (pendingRequest?.params) {
            const { peerMeta } = pendingRequest.params[0];

            const chain = peerMeta.chainId || walletChainId;

            const seshInfo = {
                name: peerMeta.name,
                url: peerMeta.url,
                icons: peerMeta.icons,
                chainId: chain,
                address,
            };

            setSessionInfo(seshInfo);
            setShowSessionModal(true);
        }
    }, [pendingRequest]);

    const dappChainId = useAppSelector((state) => state.wallet.dappChainId);

    useEffect(() => {
        if (sessionInfo) {
            if (sessionInfo.chainId) {
                dispatch(changeDappChainId(sessionInfo.chainId));
            }
        }
    }, [sessionInfo]);

    useEffect(() => {
        const network = getEthereumNetwork(dappChainId);
        const provider = initiateNewProvider(
            network,
            process.env.REACT_APP_ALCHEMY_API_KEY,
        );

        dispatch(initiateDappProvider(provider));
    }, [dappChainId, changeDappChainId, dispatch]);

    const onConnect = async (uri: string) => {
        try {
            dispatch(createPendingSession({ uri }));
            setConnectUrl('');
        } catch (err: unknown) {
            setConnectUrl('');
        } finally {
            setConnectUrl('');
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex flex-row-reverse">
                    <CloseButton />
                </div>
                <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    dispatch(createPendingSession({ uri: connectUrl }));
                    setConnectUrl('');
                }}>
                    <Stack gap={3}>
                        <QrReader onConnect={onConnect} />
                        <p style={{ textAlign: 'center', fontSize: '25px' }}>
                            or use walletconnect uri
                        </p>
                        <Form.Control
                            name="connectUrl"
                            type="text"
                            placeholder="e.g. wc:a281567bb3e4..."
                            value={connectUrl}
                            onChange={(e) => setConnectUrl(e.target.value)} />
                        <Stack direction="horizontal" gap={2}>
                            <Button
                                type="submit"
                                className="btn-primary"
                                disabled={!connectUrl}>
                                Connect
                            </Button>
                        </Stack>
                    </Stack>
                </Form>
                <SessionModal
                    sessionInfo={sessionInfo}
                    setSessionInfo={setSessionInfo}
                    show={showSessionModal}
                    setShow={setShowSessionModal} />
            </header>
        </div>
    );
};

export default ConnectWallet;
