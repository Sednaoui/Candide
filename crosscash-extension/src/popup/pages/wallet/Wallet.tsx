import React from 'react';
import { useNavigate } from 'react-router-dom';

import { trancatAddress } from '../../../lib/helpers';
import {
    Button,
    Row,
    Col,
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
        <div className='App'>
            <header className='App-header'>
                <Row>
                    <Col>
                        {`Network: ${CURRENT_NETWORK}`}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button type="button" onClick={copy}>
                            {trancatAddress(address)}
                        </Button>
                    </Col>
                    <Col>
                        <Button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                navigate('/send');
                            }}>
                            Send
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <WalletNavBar />
                    </Col>
                </Row>
            </header>
        </div>
    );
};

export default Wallet;
