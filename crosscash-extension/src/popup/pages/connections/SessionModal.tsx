import React from 'react';
import { Stack } from 'react-bootstrap';
import { useDispatch } from 'react-redux';

import { initiateNewProvider } from '../../../lib/alchemy';
import { evmNetworks } from '../../../lib/constants/networks';
import {
    trancatAddress,
    removeHttp,
    getEthereumNetwork,
} from '../../../lib/helpers';
import {
    Button,
    Modal,
    Image,
    Form,
} from '../../components';
import { useAppSelector } from '../../store';
import {
    confirmRequestSession,
    initiateDappProvider,
    rejectRequestSession,
} from '../../store/wallet/actions';

type SessionInfo = {
    name: string;
    url: string;
    icons: string[] | null;
    chainId: number | null;
    address: string | undefined;
};

type ModalProps = {
    sessionInfo: SessionInfo | null; // typing is not always positive.
    setSessionInfo: React.Dispatch<React.SetStateAction<SessionInfo | null>>
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
};

const SessionModal = ({ sessionInfo, setSessionInfo, show, setShow }: ModalProps) => {
    const dispatch = useDispatch();

    const address = sessionInfo?.address;
    const chainId = sessionInfo?.chainId;

    const payload = {
        address,
        chainId,
    };

    const walletChainId = useAppSelector((state) => state.wallet.currentNetworkChainId);

    const confirm = () => {
        if (chainId && chainId !== walletChainId) {
            const network = getEthereumNetwork(chainId);

            dispatch(initiateDappProvider(initiateNewProvider(
                network,
                process.env.REACT_APP_ALCHEMY_API_KEY,
            )));
        }

        dispatch(confirmRequestSession(payload));
        setShow(false);
    };

    const reject = () => {
        dispatch(rejectRequestSession());
        setSessionInfo(null);
        setShow(false);
    };

    const networkList = evmNetworks.map((n) => (
        <option
            key={n.chainID}
            value={n.chainID}>
            {n.name}
        </option>
    ));

    return (
        sessionInfo && (
            <Modal show={show} fullscreen onHide={() => setShow(false)}>
                <Modal.Header className="text-center">
                    <Modal.Title>
                        {sessionInfo.icons
                            && (
                                <Image
                                    src={sessionInfo.icons[0]}
                                    width={160}
                                    height={160} />
                            )}
                        {removeHttp(sessionInfo.url)}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Stack gap={3}>
                        <Form.Group>
                            <Form.Label>
                                <b>
                                    {sessionInfo.name}
                                </b>
                                {' '}
                                wants to connect to your wallet
                            </Form.Label>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Network
                            </Form.Label>
                            <Form.Select
                                required
                                onChange={(e) => setSessionInfo({
                                    ...sessionInfo,
                                    chainId: Number(e.target.value),
                                })}
                                defaultValue={Number(chainId)}>
                                {networkList}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>
                                Wallet
                            </Form.Label>
                            <Form.Control
                                type="text"
                                value={trancatAddress(sessionInfo.address || '')}
                                readOnly />
                        </Form.Group>
                    </Stack>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Stack
                        direction="horizontal"
                        className="text-center"
                        gap={3}>
                        <Button
                            type="button"
                            size="lg"
                            onClick={reject}
                            variant="warning">
                            Cancel
                        </Button>
                        <Button
                            size="lg"
                            type="button"
                            onClick={confirm}>
                            Connect
                        </Button>
                    </Stack>
                </Modal.Footer>
            </Modal>
        )
    );
};

export type { SessionInfo };
export default SessionModal;
