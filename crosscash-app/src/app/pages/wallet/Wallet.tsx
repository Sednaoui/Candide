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
import { trancatAddress } from '../../../lib/helpers';
import {
    Form,
    Button,
    Stack,
} from '../../components';
import { useAppSelector } from '../../store';
import { changeWalletChainId } from '../../store/wallet/actions';
import ConnectWallet from '../connections/ConnectWallet';
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

    return (
        <div>
            <header className="App-header">
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
                    </Stack>
                    <WalletNavBar />
                    <ConnectWallet />
                </Stack>
                <Review
                    show={showReviewModal}
                    setShow={setShowReviewModal}
                    callRequest={callRequest}
                    chainId={walletChainId} />
            </header>
        </div>
    );
};

export default Wallet;
