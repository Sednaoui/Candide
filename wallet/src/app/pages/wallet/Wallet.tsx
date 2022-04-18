import React, {
    useEffect,
    useRef,
    useState,
} from 'react';
import {
    Overlay,
    Tooltip,
} from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { evmNetworks } from '../../../lib/constants/networks';
import {
    getEthereumNetwork,
    removeHttp,
    trancatAddress,
} from '../../../lib/helpers';
import {
    Image,
    Form,
    Button,
    Stack,
} from '../../components';
import { useAppSelector } from '../../store';
import {
    useTransactionHash,
    useWalletError,
} from '../../store/hooks';
import {
    changeWalletChainId,
    disconnectSession,
    updateSession,
} from '../../store/wallet/actions';
import Review from '../transactions/review/Review';
import WalletNavBar from './WalletNavBar';

const Wallet = (): React.ReactElement => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const callRequest = useAppSelector((state) => state.wallet.callRequest);
    const wallet = useAppSelector((state) => state.wallet.walletInstance);

    const address = wallet?.address || '';

    const navigate = useNavigate();

    const [show, setShow] = useState(false);
    const target = useRef(null);

    const copy = async () => {
        if (wallet) {
            await navigator.clipboard.writeText(wallet.address);
            // show tooltip for 1 seconds
            setShow(true);
            setTimeout(() => {
                setShow(false);
            }, 1000);
        }
    };

    const dispatch = useDispatch();
    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);
    const dappChainId = useAppSelector((state) => state.wallet.dappChainId);

    const networkList = evmNetworks.map((n) => (
        <option
            key={n.chainID}
            value={n.chainID}>
            {n.name}
        </option>
    ));

    useEffect(() => {
        if (callRequest) {
            setShowReviewModal(true);
        }
    }, [callRequest]);

    const loadingWatchBridgeTransaction = useAppSelector((state) =>
        state.wallet.loadingWatchBridgeTransaction);

    const sourceChain = getEthereumNetwork(walletChainId);
    const destinationChain = getEthereumNetwork(dappChainId);

    const transactionHash = useTransactionHash();

    const [blockExplorer, setBlockExplorer] = useState(sourceChain.blockExplorerUrl);
    const callRequestChainId = useAppSelector((state) => state.wallet.callRequestChainId);

    useEffect(() => {
        if (callRequestChainId) {
            if (callRequestChainId !== walletChainId) {
                setBlockExplorer(destinationChain.blockExplorerUrl);
            } else {
                setBlockExplorer(sourceChain.blockExplorerUrl);
            }
        }
    }, [callRequestChainId]);

    const error = useWalletError();

    const connected = useAppSelector((state) => state.wallet.connector?.connected);
    const connectedSession = useAppSelector((state) => state.wallet.connectedSession);

    return (
        <>
            <Stack gap={2}>
                <Form.Select
                    required
                    onChange={(e) => {
                        dispatch(changeWalletChainId(Number(e.target.value)));
                    }}
                    defaultValue={walletChainId}>
                    {networkList}
                </Form.Select>
                <Stack direction="horizontal" gap={2}>
                    <Button
                        type="button"
                        buttonRef={target}
                        onClick={copy}>
                        {trancatAddress(address)}
                    </Button>
                    <Overlay target={target.current} show={show} placement="right">
                        {(props) => (
                            <Tooltip id="overlay" {...props}>
                                Copied
                            </Tooltip>
                        )}
                    </Overlay>
                    <Button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            navigate('/send/ETH');
                        }}>
                        Send
                    </Button>
                    <Button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            navigate('/settings');
                        }}>
                        Settings
                    </Button>
                    <Button
                        type="button"
                        className="btn-primary"
                        onClick={() => {
                            navigate('/walletconnect');
                        }}>
                        Connect
                    </Button>
                </Stack>
                <WalletNavBar />
                {connected && connectedSession && connectedSession.peerMeta && (
                    <Stack
                        gap={2}
                        direction="horizontal">
                        {connectedSession.peerMeta && (
                            <Image
                                src={connectedSession.peerMeta.icons[0]}
                                width={40}
                                height={40} />
                        )}
                        <p>
                            Connected to
                            {' '}
                            <b>
                                {connectedSession.peerMeta.name}
                            </b>
                            {connectedSession.chainId && (
                                <Stack gap={3} direction="horizontal">
                                    <Form.Select
                                        required
                                        onChange={(e) => {
                                            const id = Number(e.target.value);
                                            const accounts = connectedSession.accounts[0]
                                                || address;

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
                                    <Button
                                        type="button"
                                        className="btn-secondary"
                                        disabled={!connectedSession && !connected}
                                        onClick={() => {
                                            dispatch(disconnectSession());
                                        }}>
                                        Disconnect
                                    </Button>
                                </Stack>
                            )}
                        </p>
                    </Stack>
                )}
                {/* // TODO: only display transaction submitted with eth_sendTransaction */}
                {transactionHash && blockExplorer ? (
                    <a
                        href={`${blockExplorer}/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        See Transaction on
                        {' '}
                        {removeHttp(blockExplorer)}
                        {' '}
                    </a>
                ) : null}
                {/* display loading of bridge transaction */}
                {loadingWatchBridgeTransaction && (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="sr-only" />
                        </div>
                        {' '}
                        Moving funds from
                        {' '}
                        {sourceChain.name}
                        {' '}
                        to
                        {' '}
                        {destinationChain.name}
                        ...
                    </div>
                )}
                {/* display error */}
                {error ? (
                    <p>
                        <span role="img" aria-label="error">
                            ❌
                        </span>
                        {' '}
                        {error.message}
                    </p>
                ) : null}
            </Stack>
            <Review
                show={showReviewModal}
                setShow={setShowReviewModal}
                callRequest={callRequest}
                chainId={walletChainId} />
        </>
    );
};

export default Wallet;
