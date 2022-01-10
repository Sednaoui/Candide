import {
    ListGroup,
    ListGroupItem,
} from '../../components';

// temorary asset list for testing
const assetList = [
    {
        id: 1,
        name: 'Ethereum',
        symbol: 'ETH',
        balance: '3.00',
    },
];

const AssetsList = (): React.ReactElement => (
    <ListGroup>
        {assetList.map((item) => (
            <ListGroupItem
                action
                key={item.id}
                onClick={(): void => console.log(item)}>
                {item.balance}
                {' '}
                {item.symbol}
            </ListGroupItem>
        ))}
    </ListGroup>
);

export default AssetsList;
