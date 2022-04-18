import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Form,
    Button,
    CloseButton,
    Card,
    Stack,
} from '../../components/index';
import { decryptWallet } from '../../model/wallet';
import { useAppSelector } from '../../store';
import { resetWallet } from '../../store/wallet/actions';

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

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onDelete = async () => {
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
                dispatch(resetWallet());
                navigate('/import_wallet');
            }
        }
    };

    return (
        <>
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
                    <Stack
                        direction="horizontal"
                        className="text-center"
                        gap={3}>
                        <Button
                            className="mt-3"
                            disabled={!password}
                            type="submit">
                            Reveal
                        </Button>
                        <Button
                            className="mt-3"
                            disabled={!password}
                            variant="danger"
                            type="button"
                            onClick={onDelete}>
                            Delete Wallet
                        </Button>
                    </Stack>
                </Form.Group>
            </Form>
        </>
    );
};

export default Settings;
