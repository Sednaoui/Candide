import React, { useState } from 'react';

import {
    Form,
    Button,
    CloseButton,
    Card,
} from '../../components/index';
import { decryptWallet } from '../../model/wallet';
import { useAppSelector } from '../../store';

const Settings = () => {
    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const walletEncryptedPrivateKey = walletInstance?.privateKey;

    const [password, setPassword] = useState('');
    const [mnemonic, setMenmonic] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    let mnemonicCardBody = 'Type your password to reveal your 12 words secret phrase';

    if (mnemonic) {
        mnemonicCardBody = mnemonic;
    } else if (errorMessage) {
        mnemonicCardBody = errorMessage;
    }

    return (
        <div className="App">
            <header className="App-header">
                <div className="d-flex flex-row-reverse">
                    <CloseButton />
                </div>
                <Form
                    className="mb-3"
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (walletEncryptedPrivateKey) {
                            const wallet = await decryptWallet(
                                password,
                                walletInstance,
                            );

                            if (wallet instanceof Error) {
                                setMenmonic('');
                                setErrorMessage(wallet.message);
                            } else {
                                setErrorMessage('');
                                setMenmonic(wallet.mnemonic.phrase);
                            }
                        }
                    }}>
                    <Form.Group>
                        <Form.Label>
                            EIP-155 Mnemonic
                        </Form.Label>
                        <Card border="primary">
                            <Card.Body style={{ color: 'black' }}>
                                <p>
                                    {mnemonicCardBody}
                                </p>
                            </Card.Body>
                        </Card>
                        <Form.Control
                            className="mt-3"
                            type="password"
                            placeholder="password"
                            name="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }} />
                        <Button
                            className="mt-3"
                            disabled={!password}
                            type="submit">
                            Reveal
                        </Button>
                    </Form.Group>
                </Form>
            </header>
        </div>
    );
};

export default Settings;
