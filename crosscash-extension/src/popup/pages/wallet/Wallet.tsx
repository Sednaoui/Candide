import React, {
    useEffect,
    useState,
} from 'react';
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
import { changeNetwork } from '../../store/wallet/actions';
import ConnectWallet from '../connections/ConnectWallet';
import Review from '../transactions/review/Review';
import WalletNavBar from './WalletNavBar';

const Wallet = (): React.ReactElement => {
    const [showReviewModal, setShowReviewModal] = useState(false);
    const callRequest = useAppSelector((state) => state.wallet.callRequest);
    const wallet = useAppSelector((state) => state.wallet.walletInstance);

    const address = wallet?.address || '';

    const navigate = useNavigate();

    const copy = async () => {
        if (wallet) {
            await navigator.clipboard.writeText(wallet.address);
        }
        // TODO: replace alert with overlay and tooltip
        // eslint-disable-next-line no-alert
        alert('Address copied to clipboard');
    };

    const dispatch = useDispatch();
    const currentNetworkChainId = useAppSelector((state) => state.wallet.currentNetworkChainId);

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
                            dispatch(changeNetwork(Number(e.target.value)));
                        }}
                        defaultValue={currentNetworkChainId}>
                        {networkList}
                    </Form.Select>
                    <Stack direction="horizontal" gap={2}>
                        <Button type="button" onClick={copy}>
                            {trancatAddress(address)}
                        </Button>
                        <Button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                navigate('/send/ETH');
                            }}>
                            Send
                        </Button>
                    </Stack>
                    <WalletNavBar />
                    <ConnectWallet />
                </Stack>
                <Review
                    show={showReviewModal}
                    setShow={setShowReviewModal}
                    callRequest={callRequest}
                    chainId={currentNetworkChainId} />
            </header>
        </div>
    );
};

export default Wallet;
