import { useCallback } from 'react';

import { AnyAssetTransfer } from '../../../../lib/assets';
import { trancatAddress } from '../../../../lib/helpers';
import {
    Row,
    Col,
    Offcanvas,
    Button,
} from '../../../components';
import { useAppSelector } from '../../../store';

type Props = {
    show: boolean;
    transactionItem: AnyAssetTransfer;
    close: () => void;
}

export const TransactionDetails = ({
    transactionItem,
    show,
    close,
}: Props): React.ReactElement => {
    const openExplorer = useCallback(() => {
        window
            .open(`https://etherscan.io/tx/${transactionItem.txHash}`, '_blank')
            ?.focus();
    }, [transactionItem.txHash]);

    const address = useAppSelector((state) => state.wallet.walletInstance?.address);
    const transactionDetails = useAppSelector((state) => state.transactions.transactionDetails);

    return (
        <Offcanvas
            show={show}
            placement='end'
            onHide={() => close()}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    <Button
                        type='button'
                        variant='link'
                        onClick={openExplorer}>
                        Etherscan
                    </Button>
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {transactionDetails?.txHash === transactionItem.txHash && (
                    <>
                        <Row>
                            <Col>
                                {transactionDetails.from === address ? 'Sent' : 'Received'}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {trancatAddress(transactionDetails.from)}
                            </Col>
                            <Col>
                                to
                            </Col>
                            <Col>
                                {trancatAddress(transactionDetails.to)}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Amount
                            </Col>
                            <Col>
                                {transactionItem.assetAmount.amount}
                                {' '}
                                {transactionItem.assetAmount.asset.symbol}
                            </Col>

                        </Row>
                        <Row>
                            <Col>
                                Gas
                            </Col>
                            <Col>
                                {transactionDetails.gas}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Gas Price
                            </Col>
                            <Col>
                                {transactionDetails.gasPrice}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                Block Number
                            </Col>
                            <Col>
                                {transactionDetails.blockNumber}
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                TimeStamp
                            </Col>
                            <Col>
                                {transactionDetails.date}
                            </Col>
                        </Row>
                    </>
                )}
            </Offcanvas.Body>
        </Offcanvas>
    );
};

export default TransactionDetails;
