import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

import logo from '../../../assets/logo.jpeg';
import { Stack } from '../../components';
import '../../App.css';
import { useWindowWidth } from '../../hooks/useWindowWidth';
import { useAppSelector } from '../../store';
import { useAuth } from '../auth/AuthProvider';

function Welcome(): JSX.Element {
    const auth = useAuth();
    const { walletInstance } = useAppSelector((state) => state.wallet);

    let widthM = 0;

    if (useWindowWidth() > 1000) {
        widthM = 300;
    } else {
        widthM = 700;
    }

    let initialPath = '/';

    if (walletInstance?.address && auth.user) {
        initialPath = '/wallet';
    } else if (walletInstance?.address && !auth.user) {
        initialPath = '/login';
    } else {
        initialPath = '/import_wallet';
    }

    return (
        <div className="m-auto mt-5 Card-style" style={{ width: widthM }}>
            <Stack gap={2}>
                <div className="card">
                    <img src={logo} className="card-img-top" alt="..." />
                    <div className="card-body">
                        <h5 className="card-title">Welcome to Crosscash</h5>
                        <Link className="btn btn-primary" to={initialPath}>
                            {initialPath === '/login' ? 'Login' : 'Get Started'}
                        </Link>
                    </div>
                </div>
            </Stack>
        </div>
    );
}

export default Welcome;
