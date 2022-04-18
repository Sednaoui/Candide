import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.jpeg';
import {
    Image,
    Stack,
    Container,
} from '../../components';
import '../../App.css';
import { useAppSelector } from '../../store';

function Welcome(): JSX.Element {
    const { walletInstance } = useAppSelector((state) => state.wallet);

    let initialPath = '/';

    if (walletInstance?.address) {
        initialPath = '/wallet';
    } else {
        initialPath = '/import_wallet';
    }

    return (
        <Container className="container">
            <Stack gap={2}>
                <Image
                    src={logo}
                    style={{ width: 350, maxHeight: 550 }}
                    alt="logo" />
                <h3>
                    Welcome to Candide
                </h3>
                <Link to={initialPath}>
                    {initialPath === '/wallet' ? 'Enter Wallet' : 'Get Started'}
                </Link>
            </Stack>
        </Container>
    );
}

export default Welcome;
