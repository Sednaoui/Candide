import { AnyAssetTransfer } from '../../../../lib/assets';
import { trancatAddress } from '../../../../lib/helpers';
import {
    ListGroupItem,
    Row,
    Col,
} from '../../../components';
import { useAppSelector } from '../../../store';

type TransactionItemProps = {
    transactionItem: AnyAssetTransfer;
}

export const TransactionItem = ({ transactionItem }: TransactionItemProps): React.ReactElement => {
    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    return (
        <ListGroupItem
            action
            key={transactionItem.txHash}
            onClick={(): void => console.log(transactionItem)}>
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
    );
};

export default TransactionItem;
