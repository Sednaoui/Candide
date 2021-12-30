import React from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Button,
    Row,
    Col,
} from '../components';
import { CURRENT_NETWORK } from '../model/constants';
import { useAppSelector } from '../store';

const Wallet = (): React.ReactElement => {
    const wallet = useAppSelector((state) => state.wallet.walletInstance);

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
                        {`Netowrk: ${CURRENT_NETWORK}`}
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button type="button" onClick={copy}>
                            {wallet?.address.substring(0, 4)}
                            ...
                            {wallet?.address.substring(wallet?.address.length - 4)}
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
            </header>
        </div>
    );
};

export default Wallet;
