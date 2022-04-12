import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.jpeg';
import {
    Image,
    Stack,
} from '../../components';
import '../../App.css';
import { useAppSelector } from '../../store';
import { useAuth } from '../auth/AuthProvider';

function Welcome(): JSX.Element {
    const auth = useAuth();
    const { walletInstance } = useAppSelector((state) => state.wallet);

    let initialPath = '/';

    if (walletInstance?.address && auth.user) {
        initialPath = '/wallet';
    } else if (walletInstance?.address && !auth.user) {
        initialPath = '/login';
    } else {
        initialPath = '/import_wallet';
    }

    return (
        <Container className="App-header">
            <Stack gap={2}>
                <Image src={logo} className="App-logo" alt="logo" />
                Welcome to Crosscash
                <Link to={initialPath}>
                    {initialPath === '/login' ? 'Login' : 'Get Started'}
                </Link>
            </Stack>
        </Container>
    );
}

export default Welcome;
