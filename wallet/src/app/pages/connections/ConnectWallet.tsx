import React, {
    useEffect, useState,
} from 'react';
import { useDispatch } from 'react-redux';

import { initiateNewProvider } from '../../../lib/alchemy';
import { evmNetworks } from '../../../lib/constants/networks';
import { getEthereumNetwork } from '../../../lib/helpers';
import {
    Button,
    Image,
    Stack,
    Form,
} from '../../components';
import { useAppSelector } from '../../store';
import {
    changeDappChainId,
    createPendingSession,
    disconnectSession,
    initiateDappProvider,
    updateSession,
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
    const connected = useAppSelector((state) => state.wallet.connector?.connected);

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

    const networkList = evmNetworks.map((n) => (
        <option
            key={n.chainID}
            value={n.chainID}>
            {n.name}
        </option>
    ));

    return (
        <>
            <Form onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                dispatch(createPendingSession({ uri: connectUrl }));
                setConnectUrl('');
            }}>
                <Stack gap={3}>
                    <Form.Control
                        name="connectUrl"
                        type="text"
                        placeholder="Enter WalletConnect URL (copy QR-code)"
                        value={connectUrl}
                        onChange={(e) => setConnectUrl(e.target.value)} />
                    <Stack direction="horizontal" gap={2}>
                        <Button
                            type="button"
                            className="btn-secondary"
                            disabled={!sessionInfo}
                            onClick={() => {
                                dispatch(disconnectSession());
                                setSessionInfo(null);
                            }}>
                            Disconnect
                        </Button>
                        <Button
                            type="submit"
                            className="btn-primary"
                            disabled={!connectUrl}>
                            Connect
                        </Button>
                    </Stack>
                </Stack>
            </Form>
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
            <SessionModal
                sessionInfo={sessionInfo}
                setSessionInfo={setSessionInfo}
                show={showSessionModal}
                setShow={setShowSessionModal} />
        </>
    );
};

export default ConnectWallet;
