import { utils } from 'ethers';
import React, { useState } from 'react';

import {
    Form,
    Button,
} from '../../../components/index';
import { sendETH } from '../../../model/transactions';
import { decryptWallet } from '../../../model/wallet';
import { useAppSelector } from '../../../store';

// fake token data for testing
const tokens = [{
    name: 'Ethereum',
    symbol: 'ETH',
    balance: '0.00',
}];

const Send = (): React.ReactElement => {
    const [recipient, setRecipient] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [password, setPassword] = useState('');
    const [txTransaction, setTxTransaction] = useState('');

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const walletAddress = walletInstance?.address;
    const walletEncryptedPrivateKey = walletInstance?.privateKey;

    const list = tokens.map((token) => (
        <option
            key={token.symbol}
            value={token.symbol}>
            {token.symbol}
        </option>
    ));

    return (
        <div className="App">
            <header className="App-header">
                <Form
                    className="mb-3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (walletEncryptedPrivateKey) {
                            const wallet = await decryptWallet(password, walletInstance);

                            // if wrong password, wallet will return error
                            if (typeof wallet === 'string') {
                                setTxTransaction(wallet);
                            } else if (walletAddress && wallet.privateKey) {
                                const tx = await sendETH(
                                    tokenAmount,
                                    recipient,
                                    walletAddress,
                                    wallet.privateKey,
                                );

                                // if transaction failed, tx will return error
                                if (typeof (tx) === 'string') {
                                    setTxTransaction(tx);
                                } else {
                                    setTxTransaction(tx.hash);
                                }
                            }
                        } else {
                            setTxTransaction('no wallet Instance');
                        }
                    }}>
                    <Form.Group>
                        <Form.Label>
                            Select Token
                        </Form.Label>
                        <Form.Select required>
                            {list}
                        </Form.Select>
                        <Form.Label>
                            Amount
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="0.00"
                            name="amount"
                            onChange={(e) => setTokenAmount(e.target.value)} />
                        <Form.Label>
                            Address
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="0x0d8775f648430679a709e98d2b0cb6250d2887ef"
                            name="address"
                            onChange={(e) => setRecipient(e.target.value)} />
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)} />
                        <Button
                            disabled={!utils.isAddress(recipient)}
                            type="submit"
                            className='mt-3'>
                            Send
                        </Button>
                    </Form.Group>
                </Form>
                {txTransaction && (
                    <div className="mt-3">
                        <a
                            href={`https://ropsten.etherscan.io/tx/${txTransaction}`}
                            target="_blank"
                            rel="noopener noreferrer">
                            {txTransaction}
                        </a>
                    </div>
                )}
            </header>
        </div>
    );
};

export default Send;
