import { isValidMnemonic } from 'ethers/lib/utils';
import {
    ReactElement,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
    Form,
    Button,
} from '../../components';
import { createWallet } from '../../store/wallet/actions';
import '../../App.css';

const ImportWallet = (): ReactElement => {
    const [mnemonic, setMnemonic] = useState('');
    const [password, setPassword] = useState('');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // TODO: validate mnemonic without disabling button,
    // handle when mnemonic is wrong and show error message

    // TODO: validate weak password, inform user about best practices
    // inforce strong password

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Import Account
                </h1>
                <p>
                    Enter or copy and paste the recovery phrase of your wallet.
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
                            placeholder="secret recovery phrase"
                            name="mnemonic"
                            onChange={(e) => {
                                setMnemonic(e.target.value);
                            }} />
                        <Form.Label>
                            Choose a password to encrypt your wallet
                        </Form.Label>
                        <Form.Control
                            className='mt-3'
                            type="password"
                            placeholder="password"
                            name="password"
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }} />
                        <Button
                            className='mt-3'
                            disabled={!isValidMnemonic(mnemonic) || !password}
                            type="submit">
                            Import
                        </Button>
                    </Form.Group>
                </Form>
            </header>
        </div>
    );
};

export default ImportWallet;
