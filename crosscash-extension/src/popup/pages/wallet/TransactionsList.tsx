import { trancatAddress } from '../../../util/helpers';
import {
    ListGroup,
    ListGroupItem,
} from '../../components';

// fake transactions for testing
const transactions: any = [
    {
        blockNumber: '2535368',
        timeStamp: '1477837690',
        hash: '0x8a1a9989bda84f80143181a68bc137ecefa64d0d4ebde45dd94fc0cf49e70cb6',
        to: '0x8a1a9989bda84f80143181a68bc137e',
        value: '12 ETH',
    },
];

const TransactionList = (): React.ReactElement => (
    <ListGroup>
        {transactions.map((item: any) => (
            <ListGroupItem
                action
                key={item.hash}
                onClick={(): void => console.log(item)}>
                {item.value}
                {' '}
                {trancatAddress(item.to)}
            </ListGroupItem>
        ))}
    </ListGroup>
);

export default TransactionList;
