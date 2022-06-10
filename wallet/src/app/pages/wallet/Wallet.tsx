import React, {
    useEffect,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { evmNetworks } from '../../../lib/constants/networks';
import {
    getEthereumNetwork,
    removeHttp,
} from '../../../lib/helpers';
import {
    Alert,
    Image,
    Form,
    Button,
    Stack,
    Spinner,
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
import ReceiveModal from './receive/ReceiveModal';
import WalletNavBar from './WalletNavBar';

const Wallet = (): React.ReactElement => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const callRequest = useAppSelector((state) => state.wallet.callRequest);
    const wallet = useAppSelector((state) => state.wallet.walletInstance);

    const address = wallet?.address || '';

    const navigate = useNavigate();

    const [showReceiveModal, setShowReceiveModal] = useState(false);

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

    const loading = useAppSelector((state) => state.wallet.loading);

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
                        className="btn-primary"
                        onClick={() => setShowReceiveModal(true)}>
                        Receive
                    </Button>
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
                {/* Alert */}
                <Alert variant="warning">
                    <Alert.Heading>
                        ALPHA Product
                    </Alert.Heading>
                    <p>
                        For cross-transactions, Candide Alpha currently supports spending ETH.
                        Do not attempt to spend any other asset.
                        Your ETH will automatically be bridged instead.
                        Learn more in our
                        {' '}
                        <Alert.Link href="https://docs.candidewallet.com">
                            docs
                        </Alert.Link>
                    </p>
                    <hr />
                    <div className="mb-0">
                        To cross-transact, you need a balance on both networks. Learn
                        {' '}
                        <Alert.Link href="https://docs.candidewallet.com/faq#why-do-i-need-to-have-a-balance-on-destination-network-to-transact">
                            why
                        </Alert.Link>
                    </div>
                </Alert>
                <WalletNavBar />
                {connectedSession && connectedSession.peerMeta && (
                    <Stack
                        gap={2}
                        direction="horizontal">
                        {connectedSession.peerMeta && (
                            <Image
                                src={connectedSession.peerMeta.icons[0]}
                                width={40}
                                height={40} />
                        )}
                        <Form>
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
                                        value={dappChainId}>
                                        {networkList}
                                    </Form.Select>
                                    <Button
                                        type="button"
                                        className="btn-secondary"
                                        disabled={!connectedSession}
                                        onClick={() => {
                                            dispatch(disconnectSession());
                                        }}>
                                        Disconnect
                                    </Button>
                                </Stack>
                            )}
                        </Form>
                        {/* display loading spinner */}
                        {loading && (
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </Spinner>
                        )}
                    </Stack>
                )}
                {/* // TODO: only display transaction submitted with eth_sendTransaction */}
                {typeof transactionHash === 'string' && blockExplorer ? (
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
            <ReceiveModal
                show={showReceiveModal}
                setShow={setShowReceiveModal} />
        </>
    );
};

export default Wallet;
