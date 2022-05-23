import { isValidMnemonic } from 'ethers/lib/utils';
import {
    ReactElement,
    useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Form,
    Button,
} from '../../components';
import { useAppDispatch } from '../../store';
import { createWallet } from '../../store/wallet/actions';
import '../../App.css';

const ImportWallet = (): ReactElement => {
    const [mnemonic, setMnemonic] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    // TODO: validate mnemonic without disabling button,
    // handle when mnemonic is wrong and show error message

    // TODO: validate weak password, inform user about best practices
    // inforce strong password

    const disableButton = mnemonic ? !isValidMnemonic(mnemonic) || !password : !password;

    return (
        <>
            <h1>
                Welcome Aboard
            </h1>
            <p>
                Leave empty to create a new wallet or enter your recovery phrase to import
                your wallet
            </p>
            <Form
                className="mb-3"
                onSubmit={(e) => {
                    e.preventDefault();
                    dispatch(createWallet({ password, mnemonic }));
                    navigate('/wallet');
                }}>
                <Form.Group>
                    <Form.Control
                        className="mb-3"
                        as="textarea"
                        rows={3}
                        type="text"
                        placeholder="12 words mnemonic phrase (EIP-155)"
                        name="mnemonic"
                        onChange={(e) => {
                            setMnemonic(e.target.value);
                        }} />
                    <Form.Label>
                        Choose a password to encrypt your wallet on this device
                    </Form.Label>
                    <Form.Control
                        className="mt-3"
                        type="password"
                        placeholder="password"
                        name="password"
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Must contain at least one number and one uppercase
                        and lowercase letter, and at least 8 or more characters"
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }} />
                    <Button
                        className="mt-3"
                        disabled={disableButton}
                        type="submit">
                        {mnemonic ? 'Import' : 'Create'}
                    </Button>
                </Form.Group>
            </Form>
        </>
    );
};

export default ImportWallet;
