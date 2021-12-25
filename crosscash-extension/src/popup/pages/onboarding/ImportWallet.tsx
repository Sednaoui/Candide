import { isValidMnemonic } from 'ethers/lib/utils';
import {
    ReactElement,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';

import {
    Form,
    Button,
} from '../../components';
import { createWallet } from '../../store/wallet/actions';
import '../../App.css';

const ImportWallet = (): ReactElement => {
    const [mnemonic, setMnemonic] = useState('');

    const dispatch = useDispatch();

    // TODO: validate mnemonic without disabling button,
    // handle when mnemonic is wrong and show error message

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
                        dispatch(createWallet({ password: 'secret', mnemonic }));
                    }}>
                    <Form.Group>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            type="text"
                            placeholder="secret recovery phrase"
                            name="mnemonic"
                            onChange={(e) => {
                                setMnemonic(e.target.value);
                            }} />
                        <Button
                            className='mt-3'
                            disabled={!isValidMnemonic(mnemonic)}
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
