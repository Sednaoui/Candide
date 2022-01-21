import { AlchemyProvider } from '@ethersproject/providers';
import { useState } from 'react';
import { useProvider } from 'wagmi';

import { AnyAssetTransfer } from '../../../../lib/assets';
import { trancatAddress } from '../../../../lib/helpers';
import {
    ListGroupItem,
    Row,
    Col,
} from '../../../components';
import {
    useAppDispatch,
    useAppSelector,
} from '../../../store';
import { getTransactionDetails } from '../../../store/transactions/actions';
import { TransactionDetails } from './TransactionDetails';

type TransactionItemProps = {
    transactionItem: AnyAssetTransfer;
}

export const TransactionItem = ({ transactionItem }: TransactionItemProps): React.ReactElement => {
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    const dispatch = useAppDispatch();

    const provider = useProvider() as AlchemyProvider;

    const [show, setShow] = useState(false);

    const onClickTransaction = () => {
        dispatch(getTransactionDetails({ provider, transactionHash: transactionItem.txHash }));
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    if (!transactionItem) { return <></>; }

    return (
        <>
            <ListGroupItem
                action
                key={transactionItem.txHash}
                onClick={() => onClickTransaction()}>
                <Row>
                    <Col>
                        {transactionItem.from === address ? 'Sent' : 'Received'}
                    </Col>
                    <Col>
                        {transactionItem.assetAmount.amount}
                        {' '}
                        {transactionItem.assetAmount.asset.symbol}
                    </Col>
                    <Col>
                        {`from ${trancatAddress(transactionItem.from)}`}
                    </Col>
                </Row>
            </ListGroupItem>
            <TransactionDetails
                show={show}
                close={handleClose}
                transactionItem={transactionItem} />
        </>
    );
};

export default TransactionItem;
