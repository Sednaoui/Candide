import { IJsonRpcRequest } from '@walletconnect/types';
import React, {
    useEffect,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';

import hoplogo from '../../../../assets/hop_logo.svg';
import {
    Button,
    Row,
    Col,
    Modal,
    Stack,
    Form,
    Card,
    Image,
} from '../../../components/index';
import { reviewEthereumRequests } from '../../../model/transactions';
import { decryptWallet } from '../../../model/wallet';
import { useAppSelector } from '../../../store';
import {
    useDappProvider,
    useWalletProvider,
} from '../../../store/hooks';
import {
    approveCallRequest, rejectCallRequest,
} from '../../../store/wallet/actions';

type ModalProps = {
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
    callRequest: IJsonRpcRequest | null;
    chainId: number;
}

const Review = ({ show, setShow, callRequest, chainId }: ModalProps) => {
    const [transactionData, setTransactionData] = useState([{ label: '', value: '' }]);
    const walletProvider = useWalletProvider();
    const dappProvider = useDappProvider();
    const [provider, setProvider] = useState(walletProvider);
    const [passwordRequired, setPasswordRequired] = useState(true);
    const [displayPassword, setDisplayPassword] = useState(false);

    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const walletInstance = useAppSelector((state) => state.wallet.walletInstance);
    const walletAddress = walletInstance?.address;
    const walletEncryptedPrivateKey = walletInstance?.privateKey;

    const dispatch = useDispatch();

    useEffect(() => {
        if (callRequest) {
            const transactionReview = async () => {
                const request = await reviewEthereumRequests(
                    {
                        transactionRequest: callRequest,
                        chainId,
                    },
                );

                setTransactionData(request);
            };

            if (callRequest.method === 'wallet_switchEthereumChain') {
                setPasswordRequired(false);
            }

            transactionReview();
        }
    }, [callRequest, chainId, reviewEthereumRequests, setTransactionData]);

    const walletChainId = useAppSelector((state) => state.wallet.walletChainId);
    const callRequestChainId = useAppSelector((state) => state.wallet.callRequestChainId);

    useEffect(() => {
        if (callRequestChainId) {
            if (callRequestChainId !== walletChainId) {
                setProvider(dappProvider);
            } else {
                setProvider(walletProvider);
            }
        }
    }, [callRequestChainId, walletChainId]);

    const sourceChainName = walletProvider?.network?.name?.toUpperCase() || '';
    const destinationChainName = dappProvider?.network?.name?.toUpperCase() || '';

    const [functionCalled, setFunctionCalled] = useState({ label: '', value: '' });

    useEffect(() => {
        if (transactionData) {
            const functionName = transactionData
                .find((element) => element.label === 'Function Called');

            if (functionName) {
                setFunctionCalled(functionName);
            }
        }
    }, [transactionData]);

    const incomingTransactionRequestNetwork = functionCalled.value.includes('swapAndSend')
        && sourceChainName !== destinationChainName ? sourceChainName : destinationChainName;

    return (
        <>
            <Modal show={show} fullscreen onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Review Incoming Request on
                        {' '}
                        {incomingTransactionRequestNetwork}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card border="primary">
                        <Card.Body>
                            {transactionData && transactionData.map((param) => (
                                <Row key={param.label}>
                                    <Col key={param.label}>
                                        {param.label}
                                        :
                                        {' '}
                                        {param.value}
                                    </Col>
                                </Row>
                            ))}
                        </Card.Body>
                        {functionCalled.value.includes('swapAndSend')
                            && sourceChainName !== destinationChainName
                            && (
                                <Card.Footer>
                                    <Stack>
                                        <Image
                                            src={hoplogo}
                                            width={100}
                                            height={100}
                                            alt="hop.exchange logo" />
                                        {`Moving tokens from ${sourceChainName} to
                                            ${destinationChainName} along with gas fees to 
                                            cover the next transaction on
                                            ${destinationChainName}`}
                                    </Stack>
                                </Card.Footer>
                            )}
                    </Card>
                </Modal.Body>
                <Modal.Footer>
                    <Stack gap={2}>
                        {passwordRequired ? (
                            <Form.Group>
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
                                {errorMessage || null}
                            </Form.Group>
                        ) : null}
                        <Stack
                            direction="horizontal"
                            className="text-center"
                            gap={3}>
                            <Button
                                size="lg"
                                type="button"
                                onClick={() => {
                                    dispatch(rejectCallRequest(
                                        { message: 'rejected transaction' },
                                    ));
                                    setShow(false);
                                    setTransactionData([]);
                                }}
                                variant="warning">
                                Reject
                            </Button>
                            <Button
                                disabled={passwordRequired && !password}
                                size="lg"
                                type="button"
                                className="btn-primary"
                                onClick={async () => {
                                    if (passwordRequired) {
                                        if (walletEncryptedPrivateKey) {
                                            const wallet = await decryptWallet(
                                                password,
                                                walletInstance,
                                            );

                                            if (wallet instanceof Error) {
                                                setErrorMessage(wallet.message);
                                                return;
                                            } else {
                                                setErrorMessage('');
                                            }
                                            dispatch(approveCallRequest(
                                                {
                                                    provider,
                                                    fromAddress: walletAddress,
                                                    privateKey: wallet.privateKey,
                                                },
                                            ));
                                            setShow(false);
                                            setTransactionData([]);
                                        }
                                    } else {
                                        dispatch(approveCallRequest(
                                            {
                                                provider,
                                                fromAddress: walletAddress,
                                            },
                                        ));
                                        setShow(false);
                                        setTransactionData([]);
                                    }
                                }}>
                                Accept
                            </Button>
                        </Stack>
                    </Stack>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Review;
