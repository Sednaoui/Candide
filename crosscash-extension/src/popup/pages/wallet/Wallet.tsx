import React from 'react';
import { useNavigate } from 'react-router-dom';

import { trancatAddress } from '../../../lib/helpers';
import {
    Button,
    Stack,
} from '../../components';
import { CURRENT_NETWORK } from '../../model/constants';
import { useAppSelector } from '../../store';
import WalletNavBar from './WalletNavBar';

const Wallet = (): React.ReactElement => {
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

    return (
        <div>
            <header className='App-header'>
                <Stack gap={2}>
                    {`Network: ${CURRENT_NETWORK}`}
                    <Stack direction="horizontal" gap={2}>
                        <Button type="button" onClick={copy}>
                            {trancatAddress(address)}
                        </Button>
                        <Button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                navigate('/send');
                            }}>
                            Send
                        </Button>
                    </Stack>
                    <WalletNavBar />
                </Stack>
            </header>
        </div>
    );
};

export default Wallet;
