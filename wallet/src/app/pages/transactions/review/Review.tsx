import { IJsonRpcRequest } from '@walletconnect/types';
import React, {
    useEffect,
    useState,
} from 'react';
import { useDispatch } from 'react-redux';

import {
    Button,
    Row,
    Col,
    Modal,
    Stack,
    Form,
    Card,
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

    const [password, setPassword] = useState('');

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

    return (
        <>
            <Modal show={show} fullscreen onHide={() => setShow(false)}>
                <Modal.Header>
                    <Modal.Title>
                        Review Incoming Request
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
                    </Card>
                </Modal.Body>
                <Modal.Footer className="text-center">
                    <Stack gap={2}>
                        <Form.Group>
                            <Form.Control
                                required
                                type="password"
                                placeholder="Password"
                                name="password"
                                onChange={(e) => setPassword(e.target.value)} />
                        </Form.Group>
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
                                disabled={!password}
                                size="lg"
                                type="button"
                                onClick={async () => {
                                    if (walletEncryptedPrivateKey) {
                                        const wallet = await decryptWallet(
                                            password,
                                            walletInstance,
                                        );

                                        if (wallet instanceof Error) {
                                            dispatch(rejectCallRequest(
                                                { message: wallet.message },
                                            ));
                                            return;
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
