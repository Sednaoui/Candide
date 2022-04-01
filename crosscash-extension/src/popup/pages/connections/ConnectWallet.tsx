import React, {
    useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { getEthereumNetwork } from '../../../lib/helpers';
import {
    Button,
    Row,
    Col,
    Image,
    Stack,
} from '../../components';
import { useAppSelector } from '../../store';
import {
    createPendingSession,
    disconnectSession,
} from '../../store/wallet/actions';
import SessionModal, { SessionInfo } from './SessionModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

    const pendingRequest = useAppSelector((state) => state.wallet.pendingRequest);
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);
    const chainId = useAppSelector((state) => state.wallet.currentNetworkChainId);
    const connected = useAppSelector((state) => state.wallet.connector?.connected);

    const dispatch = useDispatch();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        setConnectUrl(e.target.value);
    };

    useEffect(() => {
        if (pendingRequest?.params) {
            const { peerMeta } = pendingRequest.params[0];

            const chain = peerMeta.chainId || chainId;

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

    return (
        <>
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
                        disabled={!connectUrl}
                        onClick={() => dispatch(createPendingSession({ uri: connectUrl }))}>
                        Connect
                    </Button>
                </Col>
                <Col>
                    <Button
                        type="button"
                        className="btn-secondary"
                        onClick={() => dispatch(disconnectSession())}>
                        Disconnect
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {connected && sessionInfo && (
                        <Stack
                            gap={2}
                            direction="horizontal">
                            {sessionInfo.icons && (
                                <Image
                                    src={sessionInfo.icons[0]}
                                    width={40}
                                    height={40} />
                            )}
                            <p>
                                Connected to
                                {' '}
                                <b>
                                    {sessionInfo.name}
                                </b>
                                {' '}
                                on
                                {sessionInfo.chainId && (
                                    <b>
                                        {' '}
                                        {getEthereumNetwork(sessionInfo.chainId).name}
                                    </b>
                                )}
                            </p>
                        </Stack>
                    )}
                </Col>
            </Row>
            <SessionModal
                sessionInfo={sessionInfo}
                setSessionInfo={setSessionInfo}
                show={showSessionModal}
                setShow={setShowSessionModal} />
        </>
    );
};

export default ConnectWallet;
