import { AlchemyProvider } from '@ethersproject/providers';
import { utils } from 'ethers';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProvider } from 'wagmi';

import { ETH } from '../../../../lib/constants/currencies';
import { getEthereumNetwork } from '../../../../lib/helpers';
import {
    Form,
    Button,
    Row,
    Col,
    CloseButton,
} from '../../../components/index';
import {
    ERC20TransferGasLimit,
    ETHTransferGasLimit,
} from '../../../model/constants';
import { transferTokens } from '../../../model/transactions';
import { decryptWallet } from '../../../model/wallet';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../store';
import { getBlockPrices } from '../../../store/transactions/actions';
import GasSettings from './GasSettings';

const Send = (): React.ReactElement => {
    const provider = useProvider() as AlchemyProvider;
    const dispatch = useAppDispatch();

    const { assetSymbol } = useParams<'assetSymbol'>();
    const [assetSymbolSelect, setAssetSymbolSelect] = useState(assetSymbol);

    const [recipient, setRecipient] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [password, setPassword] = useState('');
    const [txTransaction, setTxTransaction] = useState('');

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const walletAddress = walletInstance?.address;
    const walletEncryptedPrivateKey = walletInstance?.privateKey;

    const assetList = useAppSelector((state) => state.assets.assets);

    const list = assetList.map((token) => (
        <option
            key={token.asset.symbol}
            value={token.asset.symbol}>
            {token.asset.symbol}
        </option>
    ));

    const contractAddressOfTokenSelected = useAppSelector((state) =>
        state.assets.assets.find((element) =>
            // @ts-expect-error: fix typing for AnyAssetAmount
            element.asset.symbol === assetSymbolSelect))?.asset.contractAddress;

    const defaultGasConfidence = useAppSelector((state) =>
        state.settings.defaultGasSpeed.confidence);

    React.useEffect(() => {
        if (provider) {
            dispatch(getBlockPrices({ network: getEthereumNetwork(), provider }));
        }
    }, [provider]);

    const blockPrices = useAppSelector((state) => state.transactions.blockPrices);
    const [gasPriceOfTXInETH, setGasPriceOfTxInETH] = useState('');
    const [gasLimit, setGasLimit] = useState(ETHTransferGasLimit);

    React.useEffect(() => {
        if (blockPrices) {
            const selectedGasFeeSpeedPrice = blockPrices.estimatedPrices.find((e) =>
                e.confidence === defaultGasConfidence);

            if (selectedGasFeeSpeedPrice) {
                const gasInEth = Number(utils.formatUnits(
                    Number(selectedGasFeeSpeedPrice.maxFeePerGas) * gasLimit, 'ether',
                ));

                setGasPriceOfTxInETH(gasInEth.toFixed(5));
            }
        }
    }, [blockPrices, gasLimit, defaultGasConfidence]);

    // gas settings modal
    const [show, setShow] = useState(false);
    const handleClose = () => {
        setShow(false);
    };

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
                                const tx = await transferTokens(
                                    provider,
                                    tokenAmount,
                                    recipient,
                                    wallet.privateKey,
                                    contractAddressOfTokenSelected,
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
                    <Row>
                        <Col className="d-flex flex-row-reverse">
                            <CloseButton />
                        </Col>
                    </Row>
                    <Form.Group>
                        <Form.Label>
                            Select Token
                        </Form.Label>
                        <Form.Select
                            required
                            onChange={(e) => {
                                setAssetSymbolSelect(e.target.value);
                                setGasLimit(e.target.value === ETH.symbol
                                    ? ETHTransferGasLimit : ERC20TransferGasLimit);
                            }}
                            defaultValue={assetSymbol}>
                            {list}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Amount
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="0.00"
                            name="amount"
                            onChange={(e) => setTokenAmount(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Address
                        </Form.Label>
                        <Form.Control
                            required
                            type="text"
                            placeholder="0x0d8775f648430679a709e98d2b0cb6250d2887ef"
                            name="address"
                            onChange={(e) => setRecipient(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Password
                        </Form.Label>
                        <Form.Control
                            required
                            type="password"
                            placeholder="Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)} />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>
                            Estimated Fee:
                            {' '}
                            {gasPriceOfTXInETH}
                            {' '}
                            ETH
                        </Form.Label>
                        <Button
                            variant="link"
                            type="button"
                            onClick={() => setShow(true)}>
                            Fee Settings
                        </Button>
                        <GasSettings
                            gasLimit={gasLimit}
                            show={show}
                            close={handleClose} />
                    </Form.Group>
                    <Button
                        disabled={!utils.isAddress(recipient)}
                        type="submit"
                        className="mt-3">
                        Send
                    </Button>
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
