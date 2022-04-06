import React, {
    useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { initiateNewProvider } from '../../../lib/alchemy';
import { evmNetworks } from '../../../lib/constants/networks';
import { getEthereumNetwork } from '../../../lib/helpers';
import {
    Button,
    Row,
    Col,
    Image,
    Stack,
    Form,
} from '../../components';
import { useAppSelector } from '../../store';
import {
    createPendingSession,
    disconnectSession,
    initiateDappProvider,
    updateSession,
} from '../../store/wallet/actions';
import SessionModal, { SessionInfo } from './SessionModal';

const ConnectWallet = (): React.ReactElement => {
    const [connectUrl, setConnectUrl] = useState<string>();
    const [showSessionModal, setShowSessionModal] = useState<boolean>(false);
    const [sessionInfo, setSessionInfo] = useState<SessionInfo | null>(null);

    const pendingRequest = useAppSelector((state) => state.wallet.pendingRequest);
    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);

    const address = walletInstance?.address;
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

    useEffect(() => {
        if (sessionInfo) {
            if (sessionInfo.chainId && sessionInfo.chainId !== chainId) {
                const network = getEthereumNetwork(sessionInfo.chainId);

                dispatch(initiateDappProvider(initiateNewProvider(
                    network,
                    process.env.REACT_APP_ALCHEMY_API_KEY,
                )));
            }
        }
    }, [sessionInfo, chainId]);

    const dappChainId = useAppSelector((state) => state.wallet.dappChainId);

    const networkList = evmNetworks.map((n) => (
        <option
            key={n.chainID}
            value={n.chainID}>
            {n.name}
        </option>
    ));

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
                                {sessionInfo.chainId && (
                                    <Form.Select
                                        required
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            const network = getEthereumNetwork(id);
                                            const newProvider = initiateNewProvider(network);

                                            dispatch(initiateDappProvider(newProvider));
                                            const accounts = sessionInfo.address || address;

                                            if (accounts) {
                                                dispatch(updateSession({
                                                    chainId: id,
                                                    accounts: [accounts],
                                                }));
                                            }
                                        }}
                                        defaultValue={dappChainId}>
                                        {networkList}
                                    </Form.Select>
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
