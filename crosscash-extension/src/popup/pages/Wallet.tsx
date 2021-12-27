import React from 'react';

import { Button } from '../components';
import { useAppSelector } from '../store';

const Wallet = (): React.ReactElement => {
    const wallet = useAppSelector((state) => state.wallet.walletInstance);

    const copy = async () => {
        if (wallet) {
            await navigator.clipboard.writeText(wallet.address);
        }
        // TODO: replace alert with overlay and tooltip
        // eslint-disable-next-line no-alert
        alert('Address copied to clipboard');
    };

    return (
        <div className='App'>
            <header className='App-header'>
                <Button type="button" onClick={copy}>
                    {wallet?.address.substring(0, 4)}
                    ...
                    {wallet?.address.substring(wallet?.address.length - 4)}
                </Button>
            </header>
        </div>
    );
};

export default Wallet;
