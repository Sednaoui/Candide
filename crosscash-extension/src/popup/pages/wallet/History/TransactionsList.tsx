import { AlchemyProvider } from '@ethersproject/providers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useProvider } from 'wagmi';

import { ListGroup } from '../../../components';
import { useAppSelector } from '../../../store';
import { getTransactions } from '../../../store/transactions/actions';
import TransactionItem from './TransactionItem';

const TransactionList = (): React.ReactElement => {
    const provider = useProvider() as AlchemyProvider;
    const dispatch = useDispatch();

    const address = useAppSelector((state) => state.wallet.walletInstance?.address);

    useEffect(() => {
        if (address) {
            dispatch(getTransactions({ provider, address }));
        }
    }, [provider, address]);

    const transactions = useAppSelector((state) => state.transactions.transactions);

    return (
        <ListGroup>
            {transactions.map((item) => (
                <TransactionItem transactionItem={item} />
            ))}
        </ListGroup>
    );
};

export default TransactionList;
