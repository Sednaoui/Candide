import { utils } from 'ethers';
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ETH } from '../../../../lib/constants/currencies';
import { MAINNET } from '../../../../lib/constants/networks';
import {
    getEthereumNetwork,
    removeHttp,
} from '../../../../lib/helpers';
import { EVMNetwork } from '../../../../lib/networks';
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
import { useWalletProvider } from '../../../store/hooks';
import { getBlockPrices } from '../../../store/transactions/actions';
import GasSettings from './GasSettings';

const Send = (): React.ReactElement => {
    const provider = useWalletProvider();
    const dispatch = useAppDispatch();

    const { assetSymbol } = useParams<'assetSymbol'>();
    const [assetSymbolSelect, setAssetSymbolSelect] = useState(assetSymbol);

    const [recipient, setRecipient] = useState('');
    const [tokenAmount, setTokenAmount] = useState('');
    const [password, setPassword] = useState('');
    const [displayPassword, setDisplayPassword] = useState(false);
    const [txTransaction, setTxTransaction] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

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

    const [sourceChain, setSourceChain] = useState<EVMNetwork | null>(null);

    React.useEffect(() => {
        if (provider) {
            const network = getEthereumNetwork(provider.network.chainId);

            dispatch(getBlockPrices({
                network,
                provider,
            }));
            setSourceChain(network);
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

    const blockExplorer = sourceChain?.blockExplorerUrl;

    return (
        <>
            <Form
                className="mb-3"
                onSubmit={async (e) => {
                    e.preventDefault();
                    if (walletEncryptedPrivateKey) {
                        const wallet = await decryptWallet(password, walletInstance);

                        // if wrong password, wallet will return error
                        if (wallet instanceof Error) {
                            setErrorMessage(wallet.message);
                            setTxTransaction('');
                            return;
                        }

                        if (walletAddress && provider) {
                            const tx = await transferTokens(
                                provider,
                                tokenAmount,
                                recipient,
                                wallet.privateKey,
                                contractAddressOfTokenSelected,
                            );

                            // if transaction failed, tx will return an error
                            if (tx instanceof Error) {
                                setErrorMessage(tx.message);
                                setTxTransaction('');
                                return;
                            }

                            setTxTransaction(tx.hash);
                        }
                    } else {
                        setErrorMessage('no wallet Instance');
                        setTxTransaction('');
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
                        type={displayPassword ? 'text' : 'password'}
                        placeholder="Password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)} />
                    <Form.Check
                        className="mt-3"
                        type="checkbox"
                        label="Show password"
                        onClick={() => setDisplayPassword(!displayPassword)} />
                </Form.Group>
                {/* TODO: handle estimation gas fee for arbitrum and optimism */}
                {sourceChain?.chainID === MAINNET.chainID && (
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
                )}
                <Button
                    disabled={!utils.isAddress(recipient) && !tokenAmount && !password}
                    type="submit"
                    className="mt-3">
                    Send
                </Button>
            </Form>
            {txTransaction && blockExplorer ? (
                <div className="mt-3">
                    <a
                        href={`${blockExplorer}/tx/${txTransaction}`}
                        target="_blank"
                        rel="noopener noreferrer">
                        See Transaction on
                        {' '}
                        {removeHttp(blockExplorer)}
                    </a>
                </div>
            ) : errorMessage}
        </>
    );
};

export default Send;
